#include <jni.h>
#include <dlfcn.h>
#include <android/asset_manager.h>
#include <android/asset_manager_jni.h>
#include <android/log.h>
#include <sys/stat.h>
#include <cstdio>
#include <string>
#include <vector>

#define LOG(...) __android_log_print(ANDROID_LOG_INFO, "DinoLocal", __VA_ARGS__)
static std::string readAsset(AAssetManager* mgr, const char* name) {
    AAsset* asset = AAssetManager_open(mgr, name, AASSET_MODE_BUFFER);
    if (!asset) return {};
    std::string data(static_cast<const char*>(AAsset_getBuffer(asset)), AAsset_getLength(asset));
    AAsset_close(asset);
    return data;
}
extern "C" JNIEXPORT void JNICALL Java_local_dino_LocalHook_run(JNIEnv* env, jclass, jobject assets) {
    static bool ran = false;
    static int count = 0;
    static std::string previous;
    bool initial = !ran;
    std::string command;
    if (ran) {
        if (++count % 30) return;
        FILE* f = fopen("/data/local/tmp/dino-command.js","rb");
        if (!f) return;
        char chunk[4096]; size_t n;
        while ((n=fread(chunk,1,sizeof(chunk),f))) command.append(chunk,n);
        fclose(f);
        if (command.empty() || command == previous) return;
        previous=command;
    }
    ran = true;
    void* lib = dlopen("libcocos2djs.so", RTLD_NOW);
    if (!lib) { LOG("dlopen: %s", dlerror()); return; }
    auto instance = reinterpret_cast<void*(*)()>(dlsym(lib, "_ZN13ScriptingCore11getInstanceEv"));
    auto eval = reinterpret_cast<bool(*)(void*,const char*,void*,const char*,void*,void*)>(dlsym(lib, "_ZN13ScriptingCore10evalStringEPKcPN2JS5ValueES1_P9JSContextP8JSObject"));
    auto decode = reinterpret_cast<void*(*)(void*,const void*,unsigned,void*,void*)>(dlsym(lib, "_Z15JS_DecodeScriptP9JSContextPKvjP12JSPrincipalsS4_"));
    auto decompile = reinterpret_cast<void*(*)(void*,void*,const char*,unsigned)>(dlsym(lib, "_Z18JS_DecompileScriptP9JSContextP8JSScriptPKcj"));
    auto encode = reinterpret_cast<char*(*)(void*,void*)>(dlsym(lib, "_Z21JS_EncodeStringToUTF8P9JSContextP8JSString"));
    auto freeJS = reinterpret_cast<void(*)(void*,void*)>(dlsym(lib, "_Z7JS_freeP9JSContextPv"));
    void* core = instance();
    void* cx = reinterpret_cast<void**>(core)[2];
    AAssetManager* mgr = AAssetManager_fromJava(env, assets);
    const char* folder = "/data/data/com.netease.h1.qihoo/files/decompiled";
    mkdir("/data/data/com.netease.h1.qihoo/files",0700); mkdir(folder,0700);
    const char* names[] = {"main","Start","ClientCommon","VersionControl","MainController","MainMenuScene","GameScene","ServerConnector"};
    for (const char* name : std::vector<const char*>()) {
        std::string asset = std::string("offline/decoded/") + name + ".jsc";
        std::string data = readAsset(mgr, asset.c_str());
        if (data.empty()) continue;
        void* script = decode(cx,data.data(),data.size(),nullptr,nullptr);
        if (!script) { LOG("decode failed %s",name); continue; }
        void* source = decompile(cx,script,name,4);
        if (!source) { LOG("decompile failed %s",name); continue; }
        char* text = encode(cx,source);
        if (!text) continue;
        std::string dest = std::string(folder) + "/" + name + ".js";
        FILE* f = fopen(dest.c_str(),"wb");
        if (f) { fputs(text,f); fclose(f); LOG("decompiled %s",name); }
        freeJS(cx,text);
    }
    std::string boot = readAsset(mgr,"offline/boot.js");
    FILE* overrideFile = fopen("/data/local/tmp/dino-boot.js","rb");
    if (overrideFile) {
        boot.clear(); char chunk[4096]; size_t n;
        while ((n = fread(chunk,1,sizeof(chunk),overrideFile))) boot.append(chunk,n);
        fclose(overrideFile);
    }
    if (!initial) boot = command;
    unsigned result[2] = {0,0};
    bool ok = eval(core,boot.c_str(),result,"offline/boot.js",nullptr,nullptr);
    LOG("boot eval: %d value=%08x:%08x", ok,result[1],result[0]);
    if (ok && result[0] && result[1] >= 0xffff0000u) {
        char* text = encode(cx,reinterpret_cast<void*>(result[0]));
        if (text) {
            LOG("RESULT %s",text);
            FILE* report = fopen("/data/data/com.netease.h1.qihoo/files/local-report.json","wb");
            if (report) { fputs(text,report); fclose(report); }
            freeJS(cx,text);
        }
    }
}

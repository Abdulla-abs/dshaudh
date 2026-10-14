#include <jni.h>
#include <dlfcn.h>
#include <android/asset_manager.h>
#include <android/asset_manager_jni.h>
#include <android/log.h>
#include <string>

extern "C" JNIEXPORT void JNICALL Java_local_dino_LocalHook_run(JNIEnv* env, jclass, jobject assets) {
    static bool ran = false;
    if (ran) return;
    ran = true;
    void* library = dlopen("libcocos2djs.so", RTLD_NOW);
    if (!library) return;
    auto instance = reinterpret_cast<void*(*)()>(dlsym(library,"_ZN13ScriptingCore11getInstanceEv"));
    auto eval = reinterpret_cast<bool(*)(void*,const char*,void*,const char*,void*,void*)>(dlsym(library,"_ZN13ScriptingCore10evalStringEPKcPN2JS5ValueES1_P9JSContextP8JSObject"));
    auto encode = reinterpret_cast<char*(*)(void*,void*)>(dlsym(library,"_Z21JS_EncodeStringToUTF8P9JSContextP8JSString"));
    auto freeJS = reinterpret_cast<void(*)(void*,void*)>(dlsym(library,"_Z7JS_freeP9JSContextPv"));
    if (!instance || !eval || !encode || !freeJS) return;
    auto manager = AAssetManager_fromJava(env,assets);
    auto asset = AAssetManager_open(manager,"offline/boot.js",AASSET_MODE_BUFFER);
    if (!asset) return;
    std::string script(static_cast<const char*>(AAsset_getBuffer(asset)),AAsset_getLength(asset));
    AAsset_close(asset);
    void* core = instance();
    unsigned result[2] = {0,0};
    bool ok = eval(core,script.c_str(),result,"offline/boot.js",nullptr,nullptr);
    __android_log_print(ANDROID_LOG_INFO,"DinoLocal","boot eval: %d",ok);
    if (ok && result[0] && result[1] == 0xffffff85u) {
        void* context = reinterpret_cast<void**>(core)[2];
        char* text = encode(context,reinterpret_cast<void*>(result[0]));
        if (text) {
            __android_log_print(ANDROID_LOG_INFO,"DinoLocal","RESULT %s",text);
            freeJS(context,text);
        }
    }
}

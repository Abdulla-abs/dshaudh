# jsc-decompiler

Cocos2d-x JSC 字节码反汇编和反编译器

当前支持的版本的魔术头：

```
# 不知道啥版本
0xB973C051

# spider-monkey version 33
0xB973C02C
```

## 用法

```bash
# 单文件反编译
python jsc2js.py input.jscz output.js

# 批量反编译
python jsc2js.py --batch Scripts decompiled_scripts

# 附带字节码反汇编注释
python jsc2js.py --batch Scripts decompiled_scripts --dump-bytecode

# Unicode 转义输出（\uXXXX 代替原始中文）
python jsc2js.py --batch Scripts decompiled_scripts --ascii-escapes

# 引用关系分析
python jsc2js.py --refs decompiled_scripts

# 变量级 import 注入
python jsc2js.py --imports decompiled_scripts
```



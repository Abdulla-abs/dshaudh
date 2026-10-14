"""StackItem – the value trackable on the virtual operand stack."""

import json

_ensure_ascii = False  # set True to emit \\uXXXX escapes


def set_unicode_mode(ascii_escapes):
    """If ascii_escapes=True, strings use \\uXXXX; else native Unicode."""
    global _ensure_ascii
    _ensure_ascii = ascii_escapes


class StackItem:
    __slots__ = ("type", "name", "value", "script")

    def __init__(self, tp="undefined", name=None, value=None, script=None):
        self.type = tp
        self.name = name
        self.value = value
        self.script = script

    def get_value(self):
        if self.script is not None:
            return self.script
        if self.name is not None:
            return self.name
        if self.type == "string":
            return json.dumps(self.value, ensure_ascii=_ensure_ascii)
        if self.type == "number" and self.value is not None:
            s = str(self.value)
            if s.endswith(".0"):
                s = s[:-2]
            return s
        if self.type == "boolean":
            return "true" if self.value else "false"
        if self.type in ("null", "undefined", "void"):
            return self.type
        if self.type == "function":
            if self.value and (
                "__FN_" in str(self.value)
                or "__L_" in str(self.value)
                or "__F_" in str(self.value)
            ):
                return str(self.value)
            return "(function(){/* nested */})"
        if self.type == "regexp" and self.value:
            return str(self.value)
        if self.type == "object":
            if isinstance(self.value, dict) and self.value:
                items = []
                for k, v in self.value.items():
                    vstr = (
                        v.get_value()
                        if isinstance(v, StackItem)
                        else json.dumps(v, ensure_ascii=_ensure_ascii)
                    )
                    items.append("{}:{}".format(k, vstr))
                return "{" + ",".join(items) + "}"
            return "{}"
        if self.type == "array":
            if isinstance(self.value, list) and self.value:
                items = []
                for v in self.value:
                    vstr = (
                        v.get_value()
                        if isinstance(v, StackItem)
                        else json.dumps(v, ensure_ascii=_ensure_ascii)
                    )
                    items.append(vstr)
                return "[" + ",".join(items) + "]"
            return "[]"
        return str(self.value) if self.value is not None else "undefined"

    def copy(self):
        return {
            "tp": self.type,
            "name": self.name,
            "value": self.value,
            "script": self.script,
        }

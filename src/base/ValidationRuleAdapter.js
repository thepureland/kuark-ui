"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.ValidationRuleAdapter = void 0;
var barcoder_1 = require("barcoder");
/**
 * 校验规则适配器，用于将服务端返回的校验规则适配为async-validator的校验规则
 *
 * @author K
 * @since 1.0.0
 */
var ValidationRuleAdapter = /** @class */ (function () {
    /**
     * 校验规则适配器的构造器
     *
     * @param remoteRules 服务端返回的校验规则的对象
     * @param getModel 用于获取待校验对象的函数
     * @param trigger 校验规则触发器
     */
    function ValidationRuleAdapter(remoteRules, getModel, trigger) {
        if (trigger === void 0) { trigger = 'blur'; }
        this.destRules = {};
        this.remoteRules = remoteRules;
        this.getModel = getModel;
        this.trigger = trigger;
    }
    /**
     * 返回async-validator校验规则对象
     */
    ValidationRuleAdapter.prototype.getRules = function () {
        for (var propName in this.remoteRules) {
            var rules = this.remoteRules[propName];
            for (var ruleName in rules) {
                this.parseRule(ruleName, propName, rules);
            }
        }
        return this.destRules;
    };
    ValidationRuleAdapter.prototype.parseRule = function (ruleName, propName, rules) {
        var ruleDetails = rules[ruleName];
        if (!this.destRules[propName]) {
            this.destRules[propName] = [];
        }
        var rule = { trigger: this.trigger };
        this.doParseRule(ruleName, propName, ruleDetails, rule);
        if (!rule["message"]) {
            rule["message"] = ruleDetails[0]["message"];
            this.destRules[propName].push(rule);
        }
    };
    ValidationRuleAdapter.prototype.doParseRule = function (ruleName, propName, ruleDetails, rule) {
        switch (ruleName) {
            case "Null":
                this["null"](propName, ruleDetails, rule);
                break;
            case "NotNull":
                this.notNull(propName, ruleDetails, rule);
                break;
            case "NotEmpty":
                this.notEmpty(propName, ruleDetails, rule);
                break;
            case "NotBlank":
                this.notBlank(propName, ruleDetails, rule);
                break;
            case "AssertTrue":
                this.assertTrue(propName, ruleDetails, rule);
                break;
            case "AssertFalse":
                this.assertFalse(propName, ruleDetails, rule);
                break;
            case "CodePointLength":
                this.codePointLength(propName, ruleDetails, rule);
                break;
            case "Remote":
                this.remote(propName, ruleDetails, rule);
                break;
            case "Length":
                this.length(propName, ruleDetails, rule);
                break;
            case "Compare":
                this.compare(propName, ruleDetails);
                break;
            case "Pattern":
                this.pattern(propName, ruleDetails, rule);
                break;
            case "Email":
                this.email(propName, ruleDetails, rule);
                break;
            case "Min":
                this.min(propName, ruleDetails, rule);
                break;
            case "Max":
                this.max(propName, ruleDetails, rule);
                break;
            case "Past":
                this.past(propName, ruleDetails, rule);
                break;
            case "Future":
                this.future(propName, ruleDetails, rule);
                break;
            case "PastOrPresent":
                this.pastOrPresent(propName, ruleDetails, rule);
                break;
            case "FutureOrPresent":
                this.futureOrPresent(propName, ruleDetails, rule);
                break;
            case "DurationMin":
                //TODO
                break;
            case "DurationMax":
                //TODO
                break;
            case "DecimalMin":
                this.decimalMin(propName, ruleDetails, rule);
                break;
            case "DecimalMax":
                this.decimalMax(propName, ruleDetails, rule);
                break;
            case "Range":
                this.range(propName, ruleDetails, rule);
                break;
            case "Digits":
                this.digits(propName, ruleDetails, rule);
                break;
            case "Positive":
                this.positive(propName, ruleDetails, rule);
                break;
            case "Negative":
                this.negative(propName, ruleDetails, rule);
                break;
            case "PositiveOrZero":
                this.positiveOrZero(propName, ruleDetails, rule);
                break;
            case "NegativeOrZero":
                this.negativeOrZero(propName, ruleDetails, rule);
                break;
            case "CreditCardNumber":
                this.luhnCheck(propName, ruleDetails, rule);
                break;
            case "Currency":
                //TODO
                break;
            case "EAN":
                this.ean(propName, ruleDetails, rule);
                break;
            case "LuhnCheck":
                this.luhnCheck(propName, ruleDetails, rule);
                break;
            case "Mod10Check":
                this.mod10Check(propName, ruleDetails, rule);
                break;
            case "Mod11Check":
                this.mod11Check(propName, ruleDetails, rule);
                break;
            case "ISBN":
                this.isbn(propName, ruleDetails, rule);
                break;
            case "ParameterScriptAssert":
                //TODO
                break;
            case "URL":
                this.url(propName, ruleDetails, rule);
                break;
            case "Size":
                this.size(propName, ruleDetails, rule);
                break;
            case "DictEnumCode":
                this.dictEnumCode(propName, ruleDetails, rule);
                break;
            case "Series":
                this.series(propName, ruleDetails, rule);
                break;
            case "NotNullOn":
                this.notNullOn(propName, ruleDetails, rule);
                break;
            case "Each":
                this.each(propName, ruleDetails, rule);
                break;
            case "Exist":
                this.exist(propName, ruleDetails, rule);
                break;
            case "UniqueElements":
                this.uniqueElements(propName, ruleDetails, rule);
                break;
        }
    };
    /** null约束，被校验对象可以是任何类型 */
    ValidationRuleAdapter.prototype["null"] = function (propName, ruleDetails, rule) {
        rule["validator"] = function (rule, value) { return value == null || value == ''; };
    };
    /** 非null约束，被校验对象可以是任何类型 */
    ValidationRuleAdapter.prototype.notNull = function (propName, ruleDetails, rule) {
        rule["validator"] = function (rule, value) { return value != null && value != ''; };
    };
    /** 非空约束, 被校验对象类型必须为以下之一：字符串、数组、集合、Map */
    ValidationRuleAdapter.prototype.notEmpty = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["validator"] = function (rule, value) {
            return !_this.isEmpty(value);
        };
    };
    /** 非空白约束，被校验对象类型必须为字符串 */
    ValidationRuleAdapter.prototype.notBlank = function (propName, ruleDetails, rule) {
        rule["type"] = "string";
        rule["validator"] = function (rule, value) { return value != null && value.trim() != ""; };
    };
    /** 逻辑真约束，被校验对象类型必须为Boolean，且值为true，或者值为"true"的字符串 */
    ValidationRuleAdapter.prototype.assertTrue = function (propName, ruleDetails, rule) {
        rule["validator"] = function (rule, value) { return value == null || value == '' || value == true || value == "true"; };
    };
    /** 逻辑假约束，被校验对象类型必须为Boolean，且值为false，或者值为"false"的字符串 */
    ValidationRuleAdapter.prototype.assertFalse = function (propName, ruleDetails, rule) {
        rule["validator"] = function (rule, value) { return value == null || value == '' || value == false || value == "false"; };
    };
    /** 字符串代码点长度(实际字符数)约束，被校验对象类型必须为字符串 */
    ValidationRuleAdapter.prototype.codePointLength = function (propName, ruleDetails, rule) {
        rule["type"] = "string";
        rule["validator"] = function (rule, value) {
            return value == null || value == '' || value.length >= ruleDetails[0].min && value.length <= ruleDetails[0].max;
        };
    };
    /** 远程校验 */
    ValidationRuleAdapter.prototype.remote = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["asyncValidator"] = function (rule, value) {
            return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                var params, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (value == null || value == '') {
                                // @ts-ignore
                                resolve();
                            }
                            params = {};
                            params[propName] = value;
                            return [4 /*yield*/, ajax({ url: ruleDetails[0].requestUrl, params: params })];
                        case 1:
                            result = _a.sent();
                            if (result.data) {
                                // @ts-ignore
                                resolve();
                            }
                            else {
                                reject(ruleDetails[0]["message"]);
                            }
                            return [2 /*return*/];
                    }
                });
            }); });
        };
    };
    /** 字符串长度约束，被校验对象类型必须为字符串 */
    ValidationRuleAdapter.prototype.length = function (propName, ruleDetails, rule) {
        this.codePointLength(propName, ruleDetails, rule);
    };
    /** 比较约束，支持数组类型，但是两个数组的大小必须一致 */
    ValidationRuleAdapter.prototype.compare = function (propName, ruleDetails) {
        var _this = this;
        ruleDetails.forEach(function (ruleDetail) {
            var rule = {};
            rule["asyncValidator"] = function (r, value) {
                return new Promise(function (resolve, reject) {
                    if (value == null) {
                        // @ts-ignore
                        resolve();
                    }
                    // 先计算依赖条件
                    var depends = ruleDetail["depends"];
                    if (depends) {
                        if (_this.isDependsNotPass(depends)) {
                            return true;
                        }
                    }
                    // 依赖条件不存在，或其表达式成立，再进行Compare比较逻辑
                    var anotherProperty = ruleDetail["anotherProperty"];
                    var anotherValue = _this.getModel()[anotherProperty];
                    var logic = ruleDetail["logic"];
                    var result = _this.compareTwoValue(logic, value, anotherValue);
                    if (!result) {
                        reject(ruleDetail["message"]);
                    }
                    else {
                        // @ts-ignore
                        resolve();
                    }
                });
            };
            _this.destRules[propName].push(rule);
        });
    };
    /** 正则约束，被校验对象类型必须为字符串 */
    ValidationRuleAdapter.prototype.pattern = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "string";
        rule["validator"] = function (rule, value) {
            return _this.isEmpty(value) || RegExp(ruleDetails[0]["regexp"]).test(value);
        };
    };
    /** 邮箱约束，被校验对象类型必须为字符串 */
    ValidationRuleAdapter.prototype.email = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "email";
        // 为了Each或Exists约束能取到rule["validator"]
        var pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/;
        rule["validator"] = function (rule, value) {
            return _this.isEmpty(value) || value.length <= 320 && !!value.match(pattern);
        };
    };
    /** 最小值约束，被校验对象类型必须为数值 */
    ValidationRuleAdapter.prototype.min = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "number";
        rule["validator"] = function (rule, value) { return _this.isEmpty(value) || value >= ruleDetails[0]["value"]; };
    };
    /** 最大值约束，被校验对象类型必须为数值 */
    ValidationRuleAdapter.prototype.max = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "number";
        rule["validator"] = function (rule, value) { return _this.isEmpty(value) || value <= ruleDetails[0]["value"]; };
    };
    /** 过去时间约束，被校验对象类型必须为Date */
    ValidationRuleAdapter.prototype.past = function (propName, ruleDetails, rule) {
        rule["type"] = "date";
        rule["validator"] = function (rule, value) { return value == null || value < new Date(); };
    };
    /** 未来时间约束，被校验对象类型必须为Date */
    ValidationRuleAdapter.prototype.future = function (propName, ruleDetails, rule) {
        rule["type"] = "date";
        rule["validator"] = function (rule, value) { return value == null || value > new Date(); };
    };
    /** 过去或现在时间约束，被校验对象类型必须为Date */
    ValidationRuleAdapter.prototype.pastOrPresent = function (propName, ruleDetails, rule) {
        rule["type"] = "date";
        rule["validator"] = function (rule, value) { return value == null || value <= new Date(); };
    };
    /** 未来或现在时间约束，被校验对象类型必须为Date */
    ValidationRuleAdapter.prototype.futureOrPresent = function (propName, ruleDetails, rule) {
        rule["type"] = "date";
        rule["validator"] = function (rule, value) { return value == null || value >= new Date(); };
    };
    /** 最小值约束，被校验对象类型必须为number */
    ValidationRuleAdapter.prototype.decimalMin = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "number";
        rule["validator"] = function (rule, value) {
            if (_this.isEmpty(value)) {
                return true;
            }
            else {
                var inclusive = ruleDetails[0]["inclusive"];
                var minValue = Number(ruleDetails[0]["value"]);
                return inclusive ? value >= minValue : value > minValue;
            }
        };
    };
    /** 最大值约束，被校验对象类型必须为number */
    ValidationRuleAdapter.prototype.decimalMax = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "number";
        rule["validator"] = function (rule, value) {
            if (_this.isEmpty(value)) {
                return true;
            }
            else {
                var inclusive = ruleDetails[0]["inclusive"];
                var maxValue = Number(ruleDetails[0]["value"]);
                return inclusive ? value <= maxValue : value < maxValue;
            }
        };
    };
    /** 范围约束，被校验对象类型必须为number */
    ValidationRuleAdapter.prototype.range = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "number";
        rule["validator"] = function (rule, value) {
            if (_this.isEmpty(value)) {
                return true;
            }
            else {
                var minValue = Number(ruleDetails[0]["min"]);
                var maxValue = Number(ruleDetails[0]["max"]);
                return value >= minValue && value <= maxValue;
            }
        };
    };
    /** 数值位数约束，被校验对象类型必须为number */
    ValidationRuleAdapter.prototype.digits = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "number";
        rule["validator"] = function (rule, value) {
            if (_this.isEmpty(value)) {
                return true;
            }
            else {
                var parts = value.toString().split(".");
                var maxIntegerDigits = Number(ruleDetails[0]["integer"]);
                var minFractionDigits = Number(ruleDetails[0]["fraction"]);
                var integerDigits = value <= 0 ? parts[0].length - 1 : parts[0].length;
                var fractionDigits = !parts[1] ? 0 : parts[1].length;
                return integerDigits <= maxIntegerDigits && fractionDigits <= minFractionDigits;
            }
        };
    };
    /** 正数约束，被校验对象类型必须为number */
    ValidationRuleAdapter.prototype.positive = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "number";
        rule["validator"] = function (rule, value) { return _this.isEmpty(value) || value > 0; };
    };
    /** 负数约束，被校验对象类型必须为number */
    ValidationRuleAdapter.prototype.negative = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "number";
        rule["validator"] = function (rule, value) { return _this.isEmpty(value) || value < 0; };
    };
    /** 非负数约束，被校验对象类型必须为number */
    ValidationRuleAdapter.prototype.positiveOrZero = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "number";
        rule["validator"] = function (rule, value) { return _this.isEmpty(value) || value >= 0; };
    };
    /** 非正数约束，被校验对象类型必须为number */
    ValidationRuleAdapter.prototype.negativeOrZero = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "number";
        rule["validator"] = function (rule, value) { return _this.isEmpty(value) || value <= 0; };
    };
    /** ean13条形码约束，被校验对象类型必须为number或字符串 */
    ValidationRuleAdapter.prototype.ean = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["validator"] = function (rule, value) {
            if (_this.isEmpty(value)) {
                return true;
            }
            else {
                // const barcoder = require('barcoder');
                var type = ruleDetails[0]["type"];
                return new barcoder_1["default"].constructor(type.toLowerCase()).validate(value);
            }
        };
    };
    /** luhn约束，可检测银行卡、信用卡 */
    ValidationRuleAdapter.prototype.luhnCheck = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["validator"] = function (rule, value) { return _this.isEmpty(value) || _this.checkMod10(value); };
    };
    /** mod10约束，可检测银行卡、信用卡 */
    ValidationRuleAdapter.prototype.mod10Check = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["validator"] = function (rule, value) { return _this.isEmpty(value) || _this.checkMod10(value); };
    };
    /** mod11约束，可检测银行卡、信用卡 */
    ValidationRuleAdapter.prototype.mod11Check = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["validator"] = function (rule, value) { return _this.isEmpty(value) || _this.checkMod11(value); };
    };
    /** isbn约束 */
    ValidationRuleAdapter.prototype.isbn = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["validator"] = function (rule, value) {
            if (_this.isEmpty(value)) {
                return true;
            }
            else {
                var type = ruleDetails[0]["type"];
                switch (type) {
                    case "ISBN_10":
                        return _this.checkISBN10(value);
                    case "ISBN_13":
                        return _this.checkISBN13(value);
                    case "ANY":
                        return _this.checkISBN10(value) || _this.checkISBN13(value);
                }
            }
        };
    };
    /** url约束 */
    ValidationRuleAdapter.prototype.url = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "url";
        rule["validator"] = function (rule, value) {
            if (_this.isEmpty(value)) {
                return true;
            }
            else {
                var protocol = ruleDetails[0]["protocol"];
                if (protocol && protocol != "") {
                    if (!value.trim().startsWith(protocol + "://")) {
                        return false;
                    }
                }
                var host = ruleDetails[0]["host"];
                if (host && host != "") {
                    if (value.indexOf(host) == -1) {
                        return false;
                    }
                }
                var port = ruleDetails[0]["port"];
                if (port && port != "" && port > 0) {
                    if (!value.endsWith(":" + port) && value.indexOf(":" + port + "/") == -1) {
                        return false;
                    }
                }
                var regexp = ruleDetails[0]["regexp"];
                var flag = ruleDetails[0]["flag"]; //TODO
                if (regexp && regexp != "") {
                    if (!new RegExp(regexp).test(value)) {
                        return false;
                    }
                }
                return true;
            }
        };
    };
    /** 尺寸约束，被校验对象类型必须为string、数组、集合、Map */
    ValidationRuleAdapter.prototype.size = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["validator"] = function (rule, value) {
            if (_this.isEmpty(value)) {
                return true;
            }
            else {
                var min = ruleDetails[0]["min"];
                var max = ruleDetails[0]["max"];
                if (_this.isString(value) || value instanceof Array) {
                    return value.length >= min && value.length <= max;
                }
                if (value instanceof Set || value instanceof Map) {
                    return value.size >= min && value.size <= max;
                }
                return false;
            }
        };
    };
    /** 枚举约束 */
    ValidationRuleAdapter.prototype.dictEnumCode = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["validator"] = function (rule, value) { return _this.isEmpty(value) || ruleDetails[0]["values"].indexOf(value) != -1; };
    };
    /** 数列约束，被检测的对象必须为数组或以半角逗号/空格/分号分隔的字符串 */
    ValidationRuleAdapter.prototype.series = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["validator"] = function (rule, value) {
            if (_this.isEmpty(value)) {
                return true;
            }
            else {
                if (_this.isString(value)) {
                    if (value.indexOf(",") != -1) {
                        value = value.split(",");
                    }
                    else if (value.indexOf(";") != -1) {
                        value = value.split(";");
                    }
                    else {
                        value = value.split(" ");
                    }
                }
                var size = ruleDetails[0]["size"];
                if (size != 0 && value.length != size) {
                    return false;
                }
                if (value.length == 0 || value.length == 1) {
                    return true;
                }
                return _this.validateSeries(ruleDetails[0]["type"], ruleDetails[0]["step"], value);
            }
        };
    };
    /** 非null依赖约束，当前属性的值是否可以为null，取决于定义的表达式。 */
    ValidationRuleAdapter.prototype.notNullOn = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["validator"] = function (rule, value) {
            var depends = ruleDetails[0]["depends"];
            if (_this.isDependsNotPass(depends)) {
                return true;
            }
            // 依赖条件不存在，或其表达式成立，再进行NotNull逻辑
            return !_this.isEmpty(value);
        };
    };
    /** 对数组的每一个元素应用Constraints约束，每一个元素都校验通过才算最终通过 */
    ValidationRuleAdapter.prototype.each = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "array";
        rule["validator"] = function (rule, value) {
            ruleDetails.forEach(function (r) {
                for (var ruleName in r) {
                    for (var v in value) {
                        var rule_1 = {};
                        _this.doParseRule(ruleName, propName, r[ruleName], rule_1);
                        if (!rule_1["validator"](rule_1, v)) {
                            return false;
                        }
                    }
                }
            });
            return true;
        };
    };
    /** 对数组的每一个元素应用Constraints约束，只要一个元素Constraints约束校验通过就算通过 */
    ValidationRuleAdapter.prototype.exist = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["type"] = "array";
        rule["validator"] = function (rule, value) {
            ruleDetails.forEach(function (r) {
                for (var ruleName in r) {
                    for (var v in value) {
                        var rule_2 = {};
                        _this.doParseRule(ruleName, propName, r[ruleName], rule_2);
                        if (rule_2["validator"](rule_2, v)) {
                            return true;
                        }
                    }
                }
            });
            return false;
        };
    };
    /** 惟一约束，被校验对象类型必须为数组 */
    ValidationRuleAdapter.prototype.uniqueElements = function (propName, ruleDetails, rule) {
        rule["type"] = "array";
        rule["validator"] = function (rule, value) { return new Set(value).size == value.length; };
    };
    ValidationRuleAdapter.prototype.isString = function (value) {
        return typeof value == 'string' || value instanceof String;
    };
    ValidationRuleAdapter.prototype.isEmpty = function (value) {
        if (value == null) {
            return true;
        }
        if (typeof value == 'string' || value instanceof String) {
            return value == '';
        }
        if (value instanceof Array) {
            return value.length == 0;
        }
        if (value instanceof Set || value instanceof Map) {
            return value.size == 0;
        }
        return false;
    };
    ValidationRuleAdapter.prototype.isDependsNotPass = function (depends) {
        var andOr = depends["andOr"];
        var properties = depends["properties"];
        var logics = depends["logics"];
        var values = depends["values"];
        for (var i = 0; i < properties.length; i++) {
            var property = properties[i];
            var v1 = this.getModel()[property];
            if (v1 == undefined) {
                throw new Error("指定的校验模型中不存在属性：" + property);
            }
            var v2 = null;
            if (values && values.length > i) {
                v2 = values[i];
            }
            var result = this.compareTwoValue(logics[i], v1, v2);
            if (andOr) {
                if (andOr == "AND") {
                    if (!result) {
                        return true; // 与逻辑时，只要一个条件不成立，depends就为false，就不需要进行外层的compare比较
                    }
                }
                else {
                    if (result) {
                        return false; // 或逻辑时，只要一个条件成立，depends就为true，就需要外层的compare比较
                    }
                }
            }
            else {
                return !result;
            }
        }
        return false;
    };
    ValidationRuleAdapter.prototype.compareTwoValue = function (logic, v1, v2) {
        switch (logic) {
            case "EQ":
                return v1 == v2;
            case "IEQ":
                return v1.toString().toLowerCase() == v2.toString().toLowerCase();
            case "NE":
            case "LG":
                return v1 != v2;
            case "GE":
                return v1 >= v2;
            case "LE":
                return v1 <= v2;
            case "GT":
                return v1 > v2;
            case "LT":
                return v1 < v2;
            case "LIKE":
                if (this.isString(v1)) {
                    return v1.indexOf(v2.toString()) != -1;
                }
                else {
                    return false;
                }
            case "LIKE_S":
                if (this.isString(v1)) {
                    return v1.startsWith(v2.toString());
                }
                else {
                    return false;
                }
            case "LIKE_E":
                if (this.isString(v1)) {
                    return v1.endsWith(v2.toString());
                }
                else {
                    return false;
                }
            case "ILIKE":
                if (this.isString(v1)) {
                    return v1.toLowerCase().indexOf(v2.toLowerCase()) != -1;
                }
                else {
                    return false;
                }
            case "ILIKE_S":
                if (this.isString(v1)) {
                    return v1.toLowerCase().startsWith(v2.toLowerCase());
                }
                else {
                    return false;
                }
            case "ILIKE_E":
                if (this.isString(v1)) {
                    return v1.toLowerCase().endsWith(v2.toLowerCase());
                }
                else {
                    return false;
                }
            case "IN":
                if (this.isString(v1)) {
                    return this.compareTwoValue("LIKE", v2, v1);
                }
                if (v2 instanceof Array) {
                    if (v1 instanceof Array) {
                        return v2.indexOf(v1) != -1;
                    }
                    else {
                        for (var elem in v1) {
                            if (v2.indexOf(v1) != -1) {
                                return false;
                            }
                        }
                        return true;
                    }
                }
                if (v1 instanceof Map && v2 instanceof Map) {
                    if (v1.size > v2.size) {
                        return false;
                    }
                    else {
                        v1.forEach(function (v, k) {
                            var value = v2.get(k);
                            if (value != k) {
                                return false;
                            }
                        });
                        return true;
                    }
                }
                return false;
            case "NOT_IN":
                return !this.compareTwoValue("IN", v1, v2);
            case "IS_NULL":
            case "IS_EMPTY":
                return v1 == null || v1 == '';
            case "IS_NOT_NULL":
            case "IS_NOT_EMPTY":
                return v1 != null && v1 != '';
        }
    };
    ValidationRuleAdapter.prototype.checkMod10 = function (nums) {
        var arr = (nums + '')
            .split('')
            .reverse()
            .map(function (x) { return parseInt(x); });
        var lastDigit = arr.splice(0, 1)[0];
        var sum = arr.reduce(function (acc, val, i) { return (i % 2 !== 0 ? acc + val : acc + ((val *= 2) > 9 ? val - 9 : val)); }, 0);
        sum += lastDigit;
        return sum % 10 === 0;
    };
    ValidationRuleAdapter.prototype.checkMod11 = function (nums) {
        var arr = (nums + '')
            .split('')
            .reverse()
            .map(function (x) { return parseInt(x); });
        var lastDigit = arr.splice(0, 1)[0];
        var sum = arr.reduce(function (acc, val, i) { return (acc + (i % 6 + 2) * val); }, 0);
        var mod = sum % 11;
        var checkDigit;
        if (mod == 0) {
            checkDigit = 0;
        }
        else if (mod == 1) {
            checkDigit = 'X';
        }
        else {
            checkDigit = 11 - mod;
        }
        return checkDigit === lastDigit;
    };
    ValidationRuleAdapter.prototype.checkISBN10 = function (code) {
        code = (code + '').replace(/[-\s]/g, '');
        if (!/^\d{9}[\dxX]?$/.test(code))
            return false;
        var i = 0, c = 0; // c:checksum
        for (; i < 9;)
            c += code.charAt(i++) * i;
        c %= 11;
        var ch = c + '';
        if (c == 10)
            ch = 'X';
        return c == (i = code.charAt(9)) || ch == 'X' && i + '' == 'x';
    };
    ValidationRuleAdapter.prototype.checkISBN13 = function (code) {
        code = (code + '').replace(/[-\s]/g, '');
        if (!/^\d{12,13}$/.test(code))
            return false;
        var i = 1, c = 0; // c:checksum
        for (; i < 12; i += 2)
            c += Math.floor(code.charAt(i));
        for (c *= 3, i = 0; i < 12; i += 2)
            c += Math.floor(code.charAt(i));
        c = (220 - c) % 10; // 220:大於(1*6+3*6)，%10==0即可。
        if (code.length == 12)
            return code + c;
        return c == code.charAt(12);
    };
    ValidationRuleAdapter.prototype.validateSeries = function (type, step, values) {
        switch (type) {
            case "INC_DIFF": // 递增且互不相等
                var preValue = null;
                for (var i = 0; i < values.length; i++) {
                    var value = Number(values[i]);
                    if (preValue != null) {
                        if (step == 0.0) { // 不应用步进
                            if (preValue >= value) {
                                return false;
                            }
                        }
                        else {
                            if (preValue + step != value) {
                                return false;
                            }
                        }
                    }
                    preValue = value;
                }
                return true;
            case "DESC_DIFF": // 递减且互不相等
                return this.validateSeries("INC_DIFF", step, values.reverse());
            case "INC_DIFF_DESC_DIFF": // 先增后减且互不相等
                var maxValueIndex = this.maxValueIndex(values);
                if (maxValueIndex == values.length - 1) {
                    return false;
                }
                var incDiffValues = values.slice(0, maxValueIndex + 1);
                var incDiffPass = this.validateSeries("INC_DIFF", step, incDiffValues);
                if (incDiffPass) {
                    var descDiffValues_1 = values.slice(maxValueIndex, values.length);
                    return this.validateSeries("DESC_DIFF", step, descDiffValues_1);
                }
                else {
                    return false;
                }
            case "DESC_DIFF_INC_DIFF": // 先减后增且互不相等
                var minValueIndex = this.minValueIndex(values);
                if (minValueIndex == values.length - 1) {
                    return false;
                }
                var descDiffValues = values.slice(0, minValueIndex + 1);
                var descDiffPass = this.validateSeries("DESC_DIFF", step, descDiffValues);
                if (descDiffPass) {
                    var descDiffValues_2 = values.slice(minValueIndex, values.length);
                    return this.validateSeries("INC_DIFF", step, descDiffValues_2);
                }
                else {
                    return false;
                }
            case "DIFF": // 互不相等
                var diff = new Set(values).size == values.length;
                if (!diff) {
                    return false;
                }
                else if (step != 0.0) {
                    var preValue_1 = null;
                    for (var i = 0; i < values.length; i++) {
                        var value = Number(values[i]);
                        if (preValue_1 != null) {
                            if (Math.abs(preValue_1 - value) != step) {
                                return false;
                            }
                        }
                        preValue_1 = value;
                    }
                }
                return true;
            case "INC_EQ": // 递增或相等
                var preV = null;
                for (var i = 0; i < values.length; i++) {
                    var value = Number(values[i]);
                    if (preV != null) {
                        if (step == 0.0) { // 不应用步进
                            if (preV > value) {
                                return false;
                            }
                        }
                        else {
                            if (preV != value && preV + step != value) {
                                return false;
                            }
                        }
                    }
                    preV = value;
                }
                return true;
            case "DESC_EQ": // 递减或相等
                return this.validateSeries("INC_EQ", step, values.reverse());
            case "INC_EQ_DESC_EQ": // 先递增或相等，再递减或相等
                var maxValueStartIndex = this.maxValueIndex(values);
                var maxValue = values[maxValueStartIndex];
                if (maxValueStartIndex == 0 || maxValueStartIndex == values.length - 1) {
                    return false;
                }
                var maxValueEndIndex = maxValueStartIndex;
                for (var index = maxValueStartIndex; index < values.length; index++) {
                    if (values[index] == maxValue) {
                        maxValueEndIndex = index;
                    }
                    else {
                        break;
                    }
                }
                var incEqValues = values.slice(0, maxValueStartIndex + 1);
                var incEqPass = this.validateSeries("INC_EQ", step, incEqValues);
                if (incEqPass) {
                    var descEqValues_1 = values.slice(maxValueEndIndex, values.length);
                    return this.validateSeries("DESC_EQ", step, descEqValues_1);
                }
                else {
                    return false;
                }
            case "DESC_EQ_INC_EQ": // 先递减或相等，再递增或相等
                var minValueStartIndex = this.minValueIndex(values);
                var minValue = values[minValueStartIndex];
                if (minValueStartIndex == 0 || minValueStartIndex == values.length - 1) {
                    return false;
                }
                var minValueEndIndex = minValueStartIndex;
                for (var index = minValueStartIndex; index < values.length; index++) {
                    if (values[index] == minValue) {
                        minValueEndIndex = index;
                    }
                    else {
                        break;
                    }
                }
                var descEqValues = values.slice(0, minValueStartIndex + 1);
                var descEqPass = this.validateSeries("DESC_EQ", step, descEqValues);
                if (descEqPass) {
                    var incEqValues_1 = values.slice(minValueEndIndex, values.length);
                    return this.validateSeries("INC_EQ", step, incEqValues_1);
                }
                else {
                    return false;
                }
            case "EQ": // 全等
                return new Set(values).size == 1;
        }
    };
    ValidationRuleAdapter.prototype.maxValueIndex = function (values) {
        var maxValueIndex = 0;
        var maxValue = null;
        values.forEach(function (value, index) {
            if (maxValue == null) {
                maxValue = value;
            }
            else {
                if (value > maxValue) {
                    maxValue = value;
                    maxValueIndex = index;
                }
            }
        });
        return maxValueIndex;
    };
    ValidationRuleAdapter.prototype.minValueIndex = function (values) {
        var minValueIndex = 0;
        var minValue = null;
        values.forEach(function (value, index) {
            if (minValue == null) {
                minValue = value;
            }
            else {
                if (value < minValue) {
                    minValue = value;
                    minValueIndex = index;
                }
            }
        });
        return minValueIndex;
    };
    return ValidationRuleAdapter;
}());
exports.ValidationRuleAdapter = ValidationRuleAdapter;

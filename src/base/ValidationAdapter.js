var ValidationAdapter = /** @class */ (function () {
    function ValidationAdapter(origRules, model) {
        this.destRules = {};
        this.origRules = origRules;
        this.model = model;
    }
    ValidationAdapter.prototype.getRules = function () {
        for (var propName in this.origRules) {
            var rules = this.origRules[propName];
            for (var ruleName in rules) {
                var ruleDetails = rules[ruleName];
                if (!this.destRules[propName]) {
                    this.destRules[propName] = [];
                }
                var rule = {};
                switch (ruleName) {
                    case "Null":
                        this.null(propName, ruleDetails, rule);
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
                    case "min":
                        this.min(propName, ruleDetails, rule);
                        break;
                    case "max":
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
                        //TODO
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
                    case "Constraints":
                        this.constraints(propName, ruleDetails, rule);
                        break;
                    case "Valid":
                        this.valid(propName, ruleDetails, rule);
                        break;
                }
                if (!rule["message"]) {
                    rule["message"] = ruleDetails[0]["message"];
                    this.destRules[propName].push(rule);
                }
            }
        }
        return null;
    };
    /** null约束，被校验对象可以是任何类型 */
    ValidationAdapter.prototype.null = function (propName, ruleDetails, rule) {
        rule["validator"] = function (rule, value) { return value == null; };
    };
    /** 非null约束，被校验对象可以是任何类型 */
    ValidationAdapter.prototype.notNull = function (propName, ruleDetails, rule) {
        rule["validator"] = function (rule, value) { return value != null; };
    };
    /** 非空约束, 被校验对象类型必须为以下之一：字符串、数组、列表、集合、Map */
    ValidationAdapter.prototype.notEmpty = function (propName, ruleDetails, rule) {
        rule["validator"] = function (rule, value) { return value != null && !value.isEmpty(); };
    };
    /** 非空白约束，被校验对象类型必须为字符串 */
    ValidationAdapter.prototype.notBlank = function (propName, ruleDetails, rule) {
        rule["type"] = "string";
        rule["validator"] = function (rule, value) { return value != null && value.trim() != ""; };
    };
    /** 逻辑真约束，被校验对象类型必须为Boolean，且值为true，或者值为"true"的字符串 */
    ValidationAdapter.prototype.assertTrue = function (propName, ruleDetails, rule) {
        rule["validator"] = function (rule, value) { return value == null || value == true || value == "true"; };
    };
    /** 逻辑假约束，被校验对象类型必须为Boolean，且值为false，或者值为"false"的字符串 */
    ValidationAdapter.prototype.assertFalse = function (propName, ruleDetails, rule) {
        rule["validator"] = function (rule, value) { return value == null || value == false || value == "false"; };
    };
    /** 字符串代码点长度(实际字符数)约束，被校验对象类型必须为字符串 */
    ValidationAdapter.prototype.codePointLength = function (propName, ruleDetails, rule) {
        rule["type"] = "string";
        rule["validator"] = function (rule, value) {
            return value == null || value.length >= ruleDetails[0].min && value.length <= ruleDetails[0].max;
        };
    };
    /** 远程校验 */
    ValidationAdapter.prototype.remote = function (propName, ruleDetails, rule) {
        rule["validator"] = function (rule, value) {
            // @ts-ignore
            return value == null || ajax({ url: ruleDetails[0].requestUrl, params: { propName: "" } }).data;
        };
    };
    /** 字符串长度约束，被校验对象类型必须为字符串 */
    ValidationAdapter.prototype.length = function (propName, ruleDetails, rule) {
        this.codePointLength(propName, ruleDetails, rule);
    };
    /** 比较约束，支持数组类型，但是两个数组的大小必须一致 */
    ValidationAdapter.prototype.compare = function (propName, ruleDetails) {
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
                        var andOr = depends["andOr"];
                        var properties = depends["properties"];
                        var logics = depends["logics"];
                        var values = depends["values"];
                        for (var i = 0; i < properties.length; i++) {
                            var property = properties[i];
                            var result_1 = _this.compareTwoValue(logics[i], _this.model[property], values[i]);
                            if (andOr == "AND") {
                                if (!result_1) {
                                    return true; // 与逻辑时，只要一个条件不成立，depends就为false，就不需要进行外层的compare比较
                                }
                            }
                            else {
                                if (result_1) {
                                    break; // 或逻辑时，只要一个条件成立，depends就为true，就需要外层的compare比较
                                }
                            }
                        }
                    }
                    // 依赖条件不存在，或其表达式成立，再进行Compare比较逻辑
                    var anotherProperty = ruleDetail["anotherProperty"];
                    var anotherValue = _this.model[anotherProperty];
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
    ValidationAdapter.prototype.pattern = function (propName, ruleDetails, rule) {
        rule["type"] = "string";
        rule["validator"] = function (rule, value) {
            return value == null || RegExp(ruleDetails[0]["regexp"]).test(value);
        };
    };
    /** 邮箱约束，被校验对象类型必须为字符串 */
    ValidationAdapter.prototype.email = function (propName, ruleDetails, rule) {
        rule["type"] = "email";
    };
    /** 最小值约束，被校验对象类型必须为数值 */
    ValidationAdapter.prototype.min = function (propName, ruleDetails, rule) {
        rule["type"] = "number";
        rule["validator"] = function (rule, value) { return value == null || value >= ruleDetails[0]["value"]; };
    };
    /** 最大值约束，被校验对象类型必须为数值 */
    ValidationAdapter.prototype.max = function (propName, ruleDetails, rule) {
        rule["type"] = "number";
        rule["validator"] = function (rule, value) { return value == null || value <= ruleDetails[0]["value"]; };
    };
    /** 过去时间约束，被校验对象类型必须为Date */
    ValidationAdapter.prototype.past = function (propName, ruleDetails, rule) {
        rule["type"] = "date";
        rule["validator"] = function (rule, value) { return value == null || value < new Date(); };
    };
    /** 未来时间约束，被校验对象类型必须为Date */
    ValidationAdapter.prototype.future = function (propName, ruleDetails, rule) {
        rule["type"] = "date";
        rule["validator"] = function (rule, value) { return value == null || value > new Date(); };
    };
    /** 过去或现在时间约束，被校验对象类型必须为Date */
    ValidationAdapter.prototype.pastOrPresent = function (propName, ruleDetails, rule) {
        rule["type"] = "date";
        rule["validator"] = function (rule, value) { return value == null || value <= new Date(); };
    };
    /** 未来或现在时间约束，被校验对象类型必须为Date */
    ValidationAdapter.prototype.futureOrPresent = function (propName, ruleDetails, rule) {
        rule["type"] = "date";
        rule["validator"] = function (rule, value) { return value == null || value >= new Date(); };
    };
    /** 最小值约束，被校验对象类型必须为number */
    ValidationAdapter.prototype.decimalMin = function (propName, ruleDetails, rule) {
        rule["type"] = "number";
        rule["validator"] = function (rule, value) {
            if (value == null) {
                return true;
            }
            else {
                var inclusive = ruleDetails[0]["inclusive"];
                var minValueStr = ruleDetails[0]["value"];
                return inclusive ? value >= minValueStr : value > minValueStr;
            }
        };
    };
    /** 最大值约束，被校验对象类型必须为number */
    ValidationAdapter.prototype.decimalMax = function (propName, ruleDetails, rule) {
        rule["type"] = "number";
        rule["validator"] = function (rule, value) {
            if (value == null) {
                return true;
            }
            else {
                var inclusive = ruleDetails[0]["inclusive"];
                var maxValueStr = ruleDetails[0]["value"];
                return inclusive ? value >= maxValueStr : value > maxValueStr;
            }
        };
    };
    /** 范围约束，被校验对象类型必须为number */
    ValidationAdapter.prototype.range = function (propName, ruleDetails, rule) {
        rule["type"] = "number";
        rule["validator"] = function (rule, value) {
            if (value == null) {
                return true;
            }
            else {
                return value >= ruleDetails[0]["min"] && value <= ruleDetails[0]["max"];
            }
        };
    };
    /** 数值位数约束，被校验对象类型必须为number */
    ValidationAdapter.prototype.digits = function (propName, ruleDetails, rule) {
        rule["type"] = "number";
        rule["validator"] = function (rule, value) {
            if (value == null) {
                return true;
            }
            else {
                var parts = value.toString().split(".");
                return parts[0] == ruleDetails[0]["integer"] && parts[1] == ruleDetails[0]["fraction"];
            }
        };
    };
    /** 正数约束，被校验对象类型必须为number */
    ValidationAdapter.prototype.positive = function (propName, ruleDetails, rule) {
        rule["type"] = "number";
        rule["validator"] = function (rule, value) { return value == null || value > 0; };
    };
    /** 负数约束，被校验对象类型必须为number */
    ValidationAdapter.prototype.negative = function (propName, ruleDetails, rule) {
        rule["type"] = "number";
        rule["validator"] = function (rule, value) { return value == null || value < 0; };
    };
    /** 非负数约束，被校验对象类型必须为number */
    ValidationAdapter.prototype.positiveOrZero = function (propName, ruleDetails, rule) {
        rule["type"] = "number";
        rule["validator"] = function (rule, value) { return value == null || value >= 0; };
    };
    /** 非正数约束，被校验对象类型必须为number */
    ValidationAdapter.prototype.negativeOrZero = function (propName, ruleDetails, rule) {
        rule["type"] = "number";
        rule["validator"] = function (rule, value) { return value == null || value <= 0; };
    };
    /** ean13条形码约束，被校验对象类型必须为number或字符串 */
    ValidationAdapter.prototype.ean = function (propName, ruleDetails, rule) {
        rule["validator"] = function (rule, value) {
            if (value == null) {
                return true;
            }
            else {
                if (!/^[0-9]{13}$/.test(value)) {
                    return false;
                }
                else {
                    var c1 = 0;
                    var c2 = 0;
                    for (var i = 0; i < value.length; i += 2) {
                        c1 += value.charAt(i) - 0;
                        c2 += value.charAt(i + 1) - 0;
                    }
                    var cc = 10 - (c1 + c2 * 3) % 10;
                    if (cc == 10) {
                        cc = 0;
                    }
                    return value.charAt(12) == cc;
                }
            }
        };
    };
    /** luhn约束 */
    ValidationAdapter.prototype.luhnCheck = function (propName, ruleDetails, rule) {
        rule["validator"] = function (rule, value) {
            if (value == null) {
                return true;
            }
            else {
                var num = value;
                num = (num + '').replace(/\D+/g, '').split('').reverse();
                if (!num.length) {
                    return false;
                }
                var total = 0, i = void 0;
                for (i = 0; i < num.length; i++) {
                    num[i] = parseInt(num[i]);
                    total += i % 2 ? 2 * num[i] - (num[i] > 4 ? 9 : 0) : num[i];
                }
                if (total === 0) {
                    return false;
                }
                return (total % 10) == 0;
            }
        };
    };
    /** mod10约束 */
    ValidationAdapter.prototype.mod10Check = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["validator"] = function (rule, value) { return value == null || _this.checkMod10(value); };
    };
    /** isbn约束 */
    ValidationAdapter.prototype.isbn = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["validator"] = function (rule, value) {
            if (value == null) {
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
    ValidationAdapter.prototype.url = function (propName, ruleDetails, rule) {
        rule["type"] = "url";
        rule["validator"] = function (rule, value) {
            if (value == null) {
                return true;
            }
            else {
                var protocol = ruleDetails[0]["protocol"];
                if (protocol && protocol != "") {
                    if (!value.trim().startsWith(protocol)) {
                        return false;
                    }
                }
                var host = ruleDetails[0]["host"];
                if (host && host != "") {
                    if (!value.contains(host)) {
                        return false;
                    }
                }
                var port = ruleDetails[0]["port"];
                if (port && port != "") {
                    if (!value.contains(":" + port)) {
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
    ValidationAdapter.prototype.size = function (propName, ruleDetails, rule) {
        rule["validator"] = function (rule, value) {
            if (value == null) {
                return true;
            }
            else {
                var min = ruleDetails[0]["min"];
                var max = ruleDetails[0]["max"];
                if (value instanceof String || value instanceof Array) {
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
    ValidationAdapter.prototype.dictEnumCode = function (propName, ruleDetails, rule) {
        rule["validator"] = function (rule, value) { return value == null || value in ruleDetails[0]["values"]; };
    };
    /** 数列约束，数组 */
    ValidationAdapter.prototype.series = function (propName, ruleDetails, rule) {
        var _this = this;
        rule["validator"] = function (rule, value) {
            if (value == null) {
                return true;
            }
            else {
                var size = rule["size"];
                if (size != 0 && value.length != size) {
                    return false;
                }
                return _this.validateSeries(rule["type"], rule["step"], value);
            }
        };
    };
    /** 非null依赖约束，当前属性的值是否可以为null，取决于定义的表达式。 */
    ValidationAdapter.prototype.notNullOn = function (propName, ruleDetails, rule) {
    };
    ValidationAdapter.prototype.compareTwoValue = function (logic, v1, v2) {
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
                if (v1 instanceof String && v2 instanceof String) {
                    return v1.indexOf(v2.toString()) != -1;
                }
                else {
                    return false;
                }
            case "LIKE_S":
                if (v1 instanceof String && v2 instanceof String) {
                    return v1.startsWith(v2.toString());
                }
                else {
                    return false;
                }
            case "LIKE_E":
                if (v1 instanceof String && v2 instanceof String) {
                    return v1.endsWith(v2.toString());
                }
                else {
                    return false;
                }
            case "ILIKE":
                if (v1 instanceof String && v2 instanceof String) {
                    return v1.toLowerCase().indexOf(v2.toLowerCase()) != -1;
                }
                else {
                    return false;
                }
            case "ILIKE_S":
                if (v1 instanceof String && v2 instanceof String) {
                    return v1.toLowerCase().startsWith(v2.toLowerCase());
                }
                else {
                    return false;
                }
            case "ILIKE_E":
                if (v1 instanceof String && v2 instanceof String) {
                    return v1.toLowerCase().endsWith(v2.toLowerCase());
                }
                else {
                    return false;
                }
            case "IN":
                if (v1 instanceof String && v2 instanceof String) {
                    return this.compareTwoValue("LIKE", v2, v1);
                }
                if (v2 instanceof Array) {
                    if (v1 instanceof Array) {
                        return v2.indexOf(v1) != -1;
                    }
                    else {
                        for (var elem in v1) {
                            if (!v2.indexOf(v1)) {
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
                return v1 == null;
            case "IS_NOT_NULL":
                return v1 != null;
            case "IS_EMPTY":
                return v1 == "";
            case "IS_NOT_EMPTY":
                return v1 != "";
        }
    };
    ValidationAdapter.prototype.checkMod10 = function (nums) {
        var is_valid = false;
        var check_sum = 0;
        var string_nums = nums.toString();
        // 获取校验位
        var check_digit = Number(string_nums[string_nums.length - 1]);
        /**
         * 1. 移除校验位
         * 2. 逆序排序数字
         */
        var reverse_nums = string_nums
            .slice(0, string_nums.length - 1)
            .split('')
            .map(function (item) { return Number(item); })
            .reverse();
        // 为了演示算法，增加中间变量，计数数字奇偶
        var check_offset = 2;
        for (var i = 0; i < reverse_nums.length; i++) {
            var value = reverse_nums[i];
            if (check_offset % 2 === 0) {
                value = value * 2;
                value = value > 9 ? value - 9 : value;
            }
            check_sum += value;
            ++check_offset;
        }
        var got_check_digit = 10 - (check_sum % 10);
        // console.log("got check digit", got_check_digit);
        if (got_check_digit === check_digit) {
            is_valid = true;
        }
        return is_valid;
    };
    ValidationAdapter.prototype.checkISBN10 = function (code) {
        code = (code + '').replace(/[-\s]/g, '');
        if (!/^\d{9}[\dxX]?$/.test(code))
            return;
        var i = 0, c = 0; // c:checksum
        for (; i < 9;)
            c += code.charAt(i++) * i;
        c %= 11;
        var ch = c + '';
        if (c == 10)
            ch = 'X';
        return c == (i = code.charAt(9)) || ch == 'X' && i + '' == 'x';
    };
    ValidationAdapter.prototype.checkISBN13 = function (code) {
        code = (code + '').replace(/[-\s]/g, '');
        if (!/^\d{12,13}$/.test(code))
            return;
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
    ValidationAdapter.prototype.validateSeries = function (type, step, values) {
        switch (type) {
            case "INC_DIFF": // 递增且互不相等
                var preValue_1 = null;
                values.forEach(function (value) {
                    if (step == 0.0) { // 不应用步进
                        if (preValue_1 >= value) {
                            return false;
                        }
                        else {
                            if (preValue_1 + step != value) {
                                return false;
                            }
                        }
                    }
                    preValue_1 = value;
                });
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
                    var preValue_2 = null;
                    values.forEach(function (value, index) {
                        if (preValue_2 != null) {
                            if (Math.abs(preValue_2 - value) != step) {
                                return false;
                            }
                        }
                        preValue_2 = value;
                    });
                }
                return true;
            case "INC_EQ": // 递增或相等
                preValue_1 = null;
                values.forEach(function (value, index) {
                    if (preValue_1 != null) {
                        if (step == 0.0) { // 不应用步进
                            if (preValue_1 > value) {
                                return false;
                            }
                        }
                        else {
                            if (preValue_1 != value && preValue_1 + step != value) {
                                return false;
                            }
                        }
                    }
                    preValue_1 = value;
                });
                return true;
            case "DESC_EQ": // 递减或相等
                return this.validateSeries("INC_EQ", step, values.reverse());
            case "INC_EQ_DESC_EQ": // 先递增或相等，再递减或相等
                var maxValueStartIndex = this.maxValueIndex(values);
                var maxValue = values[maxValueStartIndex];
                if (maxValueStartIndex == values.length - 1) {
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
                if (minValueStartIndex == values.length - 1) {
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
    ValidationAdapter.prototype.maxValueIndex = function (values) {
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
    ValidationAdapter.prototype.minValueIndex = function (values) {
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
    return ValidationAdapter;
}());
// new ValidationAdapter({
//         "mobile": {
//             "Pattern": [{"flags": [], "message": "手机号码格式错误", "regexp": "^[0-9]*$"}],
//             "AtLeast": [{"count": 1, "logic": "IS_NOT_NULL", "message": "必须至少提供一种联系方式", "properties": ["mobile", "email"]}]
//         },
//         "email": {
//             "Email": [{"flags": [], "message": "{javax.validation.constraints.Email.message}", "regexp": ".*"}],
//             "AtLeast": [{"count": 1, "logic": "IS_NOT_NULL", "message": "必须至少提供一种联系方式", "properties": ["mobile", "email"]}]
//         },
//         "abilities": {
//             "Each": [{
//                 "NotBlank": {"message": "{javax.validation.constraints.NotBlank.message}"},
//                 "Pattern": {"flags": [], "message": "特长必须为英文字母", "regexp": "[a-zA-Z]+"}
//             }]
//         },
//         "'address.country'": {"NotNull": [{"message": "{javax.validation.constraints.NotNull.message}"}]},
//         "'address.province'": {"NotNull": [{"message": "{javax.validation.constraints.NotNull.message}"}]},
//         "age": {"Min": [{"value": 18, "message": "未满18周岁不能注册"}], "Max": [{"value": 60, "message": "超过60周岁不能注册"}]},
//         "barcode": {"EAN": [{"type": "EAN13", "message": "{org.hibernate.validator.constraints.EAN.message}"}]},
//         "bookIsbn": {"ISBN": [{"type": "ISBN_13", "message": "{org.hibernate.validator.constraints.ISBN.message}"}]},
//         "confirmPassword": {
//             "Compare": [{
//                 "anotherProperty": "password",
//                 "depends": {"andOr": "AND", "logics": ["EQ"], "properties": ["validate"], "values": ["true"]},
//                 "logic": "EQ",
//                 "message": "两次密码不同"
//             }, {"anotherProperty": "username", "logic": "IN", "message": "密码不能包含用户名"}]
//         },
//         "creditCardNumber": {
//             "CreditCardNumber": [{
//                 "message": "{org.hibernate.validator.constraints.CreditCardNumber.message}",
//                 "ignoreNonDigitCharacters": false
//             }]
//         },
//         "currency": {"Currency": [{"value": [], "message": "{org.hibernate.validator.constraints.Currency.message}"}]},
//         "date1": {"PastOrPresent": [{"message": "{javax.validation.constraints.PastOrPresent.message}"}]},
//         "date2": {"FutureOrPresent": [{"message": "{javax.validation.constraints.FutureOrPresent.message}"}]},
//         "error": {"Null": [{"message": "{javax.validation.constraints.Null.message}"}]},
//         "expireDate": {"Future": [{"message": "{javax.validation.constraints.Future.message}"}]},
//         "eyesight": {
//             "Positive": [{"message": "视力必须为正数"}],
//             "Digits": [{"message": "视力值必须是1位整数和1位小数组成", "fraction": 1, "integer": 1}]
//         },
//         "greduateDate": {"Past": [{"message": "{javax.validation.constraints.Past.message}"}]},
//         "guest": {"AssertFalse": [{"message": "{javax.validation.constraints.AssertFalse.message}"}]},
//         "height": {"Range": [{"min": 30, "max": 270, "message": "身高值必须在30cm到270cm之间"}]},
//         "hobbies": {"Size": [{"min": 3, "max": 6, "message": "业余爱好必须选3到6项"}]},
//         "job": {
//             "NotNullOn": [{
//                 "depends": {"andOr": "AND", "logics": ["GE"], "properties": ["age"], "values": ["18"]},
//                 "message": "{io.kuark.base.bean.validation.constraint.annotaions.NotNullOn.message}"
//             }]
//         },
//         "password": {
//             "NotNull": [{"message": "{javax.validation.constraints.NotNull.message}"}],
//             "Length": [{"min": 8, "max": 32, "message": "密码长度必须在8到32之间"}]
//         },
//         "photo": {
//             "URL": [{
//                 "flags": [],
//                 "host": "",
//                 "message": "{org.hibernate.validator.constraints.URL.message}",
//                 "port": -1,
//                 "protocol": "",
//                 "regexp": ".*"
//             }]
//         },
//         "question": {
//             "NotEmpty": [{"message": "{javax.validation.constraints.NotEmpty.message}"}],
//             "Series": [{"message": "机器人识别问题回答错误", "size": 0, "step": 2.0, "type": "INC_DIFF"}]
//         },
//         "remark": {
//             "Constraints": [{
//                 "NotBlank": {"message": "备注不能为空"},
//                 "Pattern": {"flags": [], "message": "备注不能包含特殊字符", "regexp": "[a-zA-Z0-9]+"}
//             }]
//         },
//         "richText": {
//             "ParameterScriptAssert": [{
//                 "message": "{org.hibernate.validator.constraints.ParametersScriptAssert.message}",
//                 "lang": "javascript",
//                 "script": "1==1"
//             }]
//         },
//         "safeQuestions": {
//             "Exist": [{"NotBlank": {}, "message": "安全问题至少要填写一个"}],
//             "UniqueElements": [{"message": "{org.hibernate.validator.constraints.UniqueElements.message}"}]
//         },
//         "sex": {"DictEnumCode": [{"message": "性别错误", "values": ["0", "1", "9"]}]},
//         "string1": {
//             "LuhnCheck": [{
//                 "endIndex": 2147483647,
//                 "message": "{org.hibernate.validator.constraints.LuhnCheck.message}",
//                 "startIndex": 0,
//                 "ignoreNonDigitCharacters": true,
//                 "checkDigitIndex": -1
//             }]
//         },
//         "string2": {
//             "Mod10Check": [{
//                 "endIndex": 2147483647,
//                 "message": "{org.hibernate.validator.constraints.Mod10Check.message}",
//                 "startIndex": 0,
//                 "multiplier": 3,
//                 "ignoreNonDigitCharacters": true,
//                 "checkDigitIndex": -1,
//                 "weight": 1
//             }]
//         },
//         "string3": {
//             "Mod11Check": [{
//                 "endIndex": 2147483647,
//                 "message": "{org.hibernate.validator.constraints.Mod11Check.message}",
//                 "threshold": 2147483647,
//                 "startIndex": 0,
//                 "ignoreNonDigitCharacters": false,
//                 "processingDirection": "RIGHT_TO_LEFT",
//                 "treatCheck11As": "0",
//                 "treatCheck10As": "X",
//                 "checkDigitIndex": -1
//             }]
//         },
//         "time1": {
//             "DurationMax": [{
//                 "nanos": 0,
//                 "message": "{org.hibernate.validator.constraints.time.DurationMax.message}",
//                 "millis": 0,
//                 "days": 0,
//                 "hours": 0,
//                 "minutes": 0,
//                 "inclusive": true,
//                 "seconds": 0
//             }]
//         },
//         "time2": {
//             "DurationMin": [{
//                 "nanos": 0,
//                 "message": "{org.hibernate.validator.constraints.time.DurationMin.message}",
//                 "millis": 0,
//                 "days": 0,
//                 "hours": 0,
//                 "minutes": 0,
//                 "inclusive": true,
//                 "seconds": 0
//             }]
//         },
//         "username": {
//             "NotBlank": [{"message": "{javax.validation.constraints.NotBlank.message}"}],
//             "CodePointLength": [{"min": 6, "max": 32, "message": "用户名字符数必须在6-32之间", "normalizationStrategy": "NONE"}],
//             "Remote": [{"message": "用户名已存在", "requestUrl": "/isUserAvailable"}]
//         },
//         "validate": {"AssertTrue": [{"message": "{javax.validation.constraints.AssertTrue.message}"}]},
//         "value1": {"Negative": [{"message": "{javax.validation.constraints.Negative.message}"}]},
//         "value2": {"NegativeOrZero": [{"message": "{javax.validation.constraints.NegativeOrZero.message}"}]},
//         "value3": {"PositiveOrZero": [{"message": "{javax.validation.constraints.PositiveOrZero.message}"}]},
//         "weigth": {
//             "DecimalMin": [{"value": "50.0", "message": "体重必须大于50.0KG", "inclusive": true}],
//             "DecimalMax": [{"value": "100.0", "message": "体重必须小于100.0KG", "inclusive": true}]
//         }
//     }
// ).getRules()

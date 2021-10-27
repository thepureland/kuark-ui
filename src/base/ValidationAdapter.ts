class ValidationAdapter {

    private origRules: any
    private model: any
    private destRules: any = {}

    constructor(origRules: any, model: any) {
        this.origRules = origRules
        this.model = model
    }

    getRules(): any {
        for (let propName in this.origRules) {
            let rules = this.origRules[propName]
            for (let ruleName in rules) {
                let ruleDetails: Array<any> = rules[ruleName]
                if (!this.destRules[propName]) {
                    this.destRules[propName] = []
                }

                const rule = {}

                switch (ruleName) {
                    case "Null":
                        this.null(propName, ruleDetails, rule)
                        break
                    case "NotNull":
                        this.notNull(propName, ruleDetails, rule)
                        break
                    case "NotEmpty":
                        this.notEmpty(propName, ruleDetails, rule)
                        break
                    case "NotBlank":
                        this.notBlank(propName, ruleDetails, rule)
                        break
                    case "AssertTrue":
                        this.assertTrue(propName, ruleDetails, rule)
                        break
                    case "AssertFalse":
                        this.assertFalse(propName, ruleDetails, rule)
                        break
                    case "CodePointLength":
                        this.codePointLength(propName, ruleDetails, rule)
                        break
                    case "Remote":
                        this.remote(propName, ruleDetails, rule)
                        break
                    case "Length":
                        this.length(propName, ruleDetails, rule)
                        break
                    case "Compare":
                        this.compare(propName, ruleDetails)
                        break
                    case "Pattern":
                        this.pattern(propName, ruleDetails, rule)
                        break
                    case "Email":
                        this.email(propName, ruleDetails, rule)
                        break
                    case "min":
                        this.min(propName, ruleDetails, rule)
                        break
                    case "max":
                        this.max(propName, ruleDetails, rule)
                        break
                    case "Past":
                        this.past(propName, ruleDetails, rule)
                        break
                    case "Future":
                        this.future(propName, ruleDetails, rule)
                        break
                    case "PastOrPresent":
                        this.pastOrPresent(propName, ruleDetails, rule)
                        break
                    case "FutureOrPresent":
                        this.futureOrPresent(propName, ruleDetails, rule)
                        break
                    case "DurationMin":
                        //TODO
                        break
                    case "DurationMax":
                        //TODO
                        break
                    case "DecimalMin":
                        this.decimalMin(propName, ruleDetails, rule)
                        break
                    case "DecimalMax":
                        this.decimalMax(propName, ruleDetails, rule)
                        break
                    case "Range":
                        this.range(propName, ruleDetails, rule)
                        break
                    case "Digits":
                        this.digits(propName, ruleDetails, rule)
                        break
                    case "Positive":
                        this.positive(propName, ruleDetails, rule)
                        break
                    case "Negative":
                        this.negative(propName, ruleDetails, rule)
                        break
                    case "PositiveOrZero":
                        this.positiveOrZero(propName, ruleDetails, rule)
                        break
                    case "NegativeOrZero":
                        this.negativeOrZero(propName, ruleDetails, rule)
                        break
                    case "CreditCardNumber":
                        //TODO
                        break
                    case "Currency":
                        //TODO
                        break
                    case "EAN":
                        this.ean(propName, ruleDetails, rule)
                        break
                    case "LuhnCheck":
                        this.luhnCheck(propName, ruleDetails, rule)
                        break
                    case "Mod10Check":
                        this.mod10Check(propName, ruleDetails, rule)
                        break
                    case "ParameterScriptAssert":
                        //TODO
                        break
                    case "URL":
                        this.url(propName, ruleDetails, rule)
                        break
                    case "Size":
                        this.size(propName, ruleDetails, rule)
                        break
                    case "DictEnumCode":
                        this.dictEnumCode(propName, ruleDetails, rule)
                        break
                    case "Series":
                        this.series(propName, ruleDetails, rule)
                        break
                    case "NotNullOn":
                        this.notNullOn(propName, ruleDetails, rule)
                        break
                    case "Each":
                        this.each(propName, ruleDetails, rule)
                        break
                    case "Exist":
                        this.exist(propName, ruleDetails, rule)
                        break
                    case "UniqueElements":
                        this.uniqueElements(propName, ruleDetails, rule)
                        break
                    case "Constraints":
                        this.constraints(propName, ruleDetails, rule)
                        break
                    case "Valid":
                        this.valid(propName, ruleDetails, rule)
                        break

                }

                if (!rule["message"]) {
                    rule["message"] = ruleDetails[0]["message"]
                    this.destRules[propName].push(rule)
                }

            }

        }
        return null
    }

    /** null约束，被校验对象可以是任何类型 */
    private null(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => value == null
    }

    /** 非null约束，被校验对象可以是任何类型 */
    private notNull(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => value != null
    }

    /** 非空约束, 被校验对象类型必须为以下之一：字符串、数组、列表、集合、Map */
    private notEmpty(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => value != null && !value.isEmpty()
    }

    /** 非空白约束，被校验对象类型必须为字符串 */
    private notBlank(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "string"
        rule["validator"] = (rule, value) => value != null && value.trim() != ""
    }

    /** 逻辑真约束，被校验对象类型必须为Boolean，且值为true，或者值为"true"的字符串 */
    private assertTrue(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => value == null || value == true || value == "true"
    }

    /** 逻辑假约束，被校验对象类型必须为Boolean，且值为false，或者值为"false"的字符串 */
    private assertFalse(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => value == null || value == false || value == "false"
    }

    /** 字符串代码点长度(实际字符数)约束，被校验对象类型必须为字符串 */
    private codePointLength(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "string"
        rule["validator"] = (rule, value) => {
            return value == null || value.length >= ruleDetails[0].min && value.length <= ruleDetails[0].max
        }
    }

    /** 远程校验 */
    private remote(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => {
            // @ts-ignore
            return value == null || ajax({url: ruleDetails[0].requestUrl, params: {propName: ""}}).data
        }
    }

    /** 字符串长度约束，被校验对象类型必须为字符串 */
    private length(propName: string, ruleDetails: Array<any>, rule: any) {
        this.codePointLength(propName, ruleDetails, rule)
    }

    /** 比较约束，支持数组类型，但是两个数组的大小必须一致 */
    private compare(propName: string, ruleDetails: Array<any>) {
        ruleDetails.forEach((ruleDetail) => {
            let rule = {}
            rule["asyncValidator"] = (r, value) => {
                return new Promise((resolve, reject) => {
                    if (value == null) {
                        // @ts-ignore
                        resolve()
                    }

                    // 先计算依赖条件
                    const depends = ruleDetail["depends"]
                    if (depends) {
                        const andOr = depends["andOr"]
                        const properties = <Array<string>>depends["properties"]
                        const logics = <Array<string>>depends["logics"]
                        const values = <Array<string>>depends["values"]
                        for (let i = 0; i < properties.length; i++) {
                            const property = properties[i]
                            const result = this.compareTwoValue(logics[i], this.model[property], values[i])
                            if (andOr == "AND") {
                                if (!result) {
                                    return true // 与逻辑时，只要一个条件不成立，depends就为false，就不需要进行外层的compare比较
                                }
                            } else {
                                if (result) {
                                    break // 或逻辑时，只要一个条件成立，depends就为true，就需要外层的compare比较
                                }
                            }
                        }
                    }

                    // 依赖条件不存在，或其表达式成立，再进行Compare比较逻辑
                    const anotherProperty = ruleDetail["anotherProperty"]
                    const anotherValue = this.model[anotherProperty]
                    const logic = ruleDetail["logic"]
                    const result = this.compareTwoValue(logic, value, anotherValue)
                    if (!result) {
                        reject(ruleDetail["message"])
                    } else {
                        // @ts-ignore
                        resolve()
                    }
                });
            }
            this.destRules[propName].push(rule)
        })
    }

    /** 正则约束，被校验对象类型必须为字符串 */
    private pattern(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "string"
        rule["validator"] = (rule, value) => {
            return value == null || RegExp(ruleDetails[0]["regexp"]).test(value)
        }
    }

    /** 邮箱约束，被校验对象类型必须为字符串 */
    private email(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "email"
    }

    /** 最小值约束，被校验对象类型必须为数值 */
    private min(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => value == null || value >= ruleDetails[0]["value"]
    }

    /** 最大值约束，被校验对象类型必须为数值 */
    private max(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => value == null || value <= ruleDetails[0]["value"]
    }

    /** 过去时间约束，被校验对象类型必须为Date */
    private past(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "date"
        rule["validator"] = (rule, value) => value == null || value < new Date()
    }

    /** 未来时间约束，被校验对象类型必须为Date */
    private future(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "date"
        rule["validator"] = (rule, value) => value == null || value > new Date()
    }

    /** 过去或现在时间约束，被校验对象类型必须为Date */
    private pastOrPresent(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "date"
        rule["validator"] = (rule, value) => value == null || value <= new Date()
    }

    /** 未来或现在时间约束，被校验对象类型必须为Date */
    private futureOrPresent(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "date"
        rule["validator"] = (rule, value) => value == null || value >= new Date()
    }

    /** 最小值约束，被校验对象类型必须为number */
    private decimalMin(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => {
            if (value == null) {
                return true
            } else {
                const inclusive = <Boolean>ruleDetails[0]["inclusive"]
                const minValueStr = <String>ruleDetails[0]["value"]
                return inclusive ? value >= minValueStr : value > minValueStr
            }
        }
    }

    /** 最大值约束，被校验对象类型必须为number */
    private decimalMax(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => {
            if (value == null) {
                return true
            } else {
                const inclusive = <Boolean>ruleDetails[0]["inclusive"]
                const maxValueStr = <String>ruleDetails[0]["value"]
                return inclusive ? value >= maxValueStr : value > maxValueStr
            }
        }
    }

    /** 范围约束，被校验对象类型必须为number */
    private range(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => {
            if (value == null) {
                return true
            } else {
                return value >= ruleDetails[0]["min"] && value <= ruleDetails[0]["max"]
            }
        }
    }

    /** 数值位数约束，被校验对象类型必须为number */
    private digits(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => {
            if (value == null) {
                return true
            } else {
                const parts = value.toString().split(".")
                return parts[0] == ruleDetails[0]["integer"] && parts[1] == ruleDetails[0]["fraction"]
            }
        }
    }

    /** 正数约束，被校验对象类型必须为number */
    private positive(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => value == null || value > 0
    }

    /** 负数约束，被校验对象类型必须为number */
    private negative(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => value == null || value < 0
    }

    /** 非负数约束，被校验对象类型必须为number */
    private positiveOrZero(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => value == null || value >= 0
    }

    /** 非正数约束，被校验对象类型必须为number */
    private negativeOrZero(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => value == null || value <= 0
    }

    /** ean13条形码约束，被校验对象类型必须为number或字符串 */
    private ean(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => {
            if (value == null) {
                return true
            } else {
                if (!/^[0-9]{13}$/.test(value)) {
                    return false
                } else {
                    let c1 = 0
                    let c2 = 0
                    for (let i = 0; i < value.length; i += 2) {
                        c1 += value.charAt(i) - 0
                        c2 += value.charAt(i + 1) - 0
                    }
                    let cc = 10 - (c1 + c2 * 3) % 10
                    if (cc == 10) {
                        cc = 0
                    }
                    return value.charAt(12) == cc
                }
            }
        }
    }

    /** luhn约束 */
    private luhnCheck(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => {
            if (value == null) {
                return true
            } else {
                let num = value
                num = (num + '').replace(/\D+/g, '').split('').reverse();
                if (!num.length) {
                    return false;
                }
                let total = 0, i;
                for (i = 0; i < num.length; i++) {
                    num[i] = parseInt(num[i]);
                    total += i % 2 ? 2 * num[i] - (num[i] > 4 ? 9 : 0) : num[i];
                }
                if (total === 0) {
                    return false;
                }
                return (total % 10) == 0;
            }
        }
    }

    /** mod10约束 */
    private mod10Check(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => value == null || this.checkMod10(value)
    }

    /** isbn约束 */
    private isbn(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => {
            if (value == null) {
                return true
            } else {
                const type = ruleDetails[0]["type"]
                switch (type) {
                    case "ISBN_10":
                        return this.checkISBN10(value)
                    case "ISBN_13":
                        return this.checkISBN13(value)
                    case "ANY":
                        return this.checkISBN10(value) || this.checkISBN13(value)
                }
            }
        }
    }

    /** url约束 */
    private url(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "url"
        rule["validator"] = (rule, value) => {
            if (value == null) {
                return true
            } else {
                const protocol = ruleDetails[0]["protocol"]
                if (protocol && protocol != "") {
                    if (!value.trim().startsWith(protocol)) {
                        return false
                    }
                }

                const host = ruleDetails[0]["host"]
                if (host && host != "") {
                    if (!value.contains(host)) {
                        return false
                    }
                }

                const port = ruleDetails[0]["port"]
                if (port && port != "") {
                    if (!value.contains(":" + port)) {
                        return false
                    }
                }

                const regexp = ruleDetails[0]["regexp"]
                const flag = ruleDetails[0]["flag"] //TODO
                if (regexp && regexp != "") {
                    if (!new RegExp(regexp).test(value)) {
                        return false
                    }
                }

                return true
            }
        }
    }

    /** 尺寸约束，被校验对象类型必须为string、数组、集合、Map */
    private size(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => {
            if (value == null) {
                return true
            } else {
                const min = ruleDetails[0]["min"]
                const max = ruleDetails[0]["max"]
                if (value instanceof String || value instanceof Array) {
                    return value.length >= min && value.length <= max
                }
                if (value instanceof Set || value instanceof Map) {
                    return value.size >= min && value.size <= max
                }
                return false
            }
        }
    }

    /** 枚举约束 */
    private dictEnumCode(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => value == null || value in ruleDetails[0]["values"]
    }

    /** 数列约束，数组 */
    private series(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => {
            if (value == null) {
                return true
            } else {
                const size = rule["size"]
                if (size != 0 && value.length != size) {
                    return false
                }
                return this.validateSeries(rule["type"], rule["step"], value)
            }
        }
    }

    /** 非null依赖约束，当前属性的值是否可以为null，取决于定义的表达式。 */
    private notNullOn(propName: string, ruleDetails: Array<any>, rule: any) {

    }


    private compareTwoValue(logic: string, v1: any, v2: any): Boolean {
        switch (logic) {
            case "EQ":
                return v1 == v2
            case "IEQ":
                return v1.toString().toLowerCase() == v2.toString().toLowerCase()
            case "NE":
            case "LG":
                return v1 != v2
            case "GE":
                return v1 >= v2
            case "LE":
                return v1 <= v2
            case "GT":
                return v1 > v2
            case "LT":
                return v1 < v2
            case "LIKE":
                if (v1 instanceof String && v2 instanceof String) {
                    return v1.indexOf(v2.toString()) != -1
                } else {
                    return false
                }
            case "LIKE_S":
                if (v1 instanceof String && v2 instanceof String) {
                    return v1.startsWith(v2.toString())
                } else {
                    return false
                }
            case "LIKE_E":
                if (v1 instanceof String && v2 instanceof String) {
                    return v1.endsWith(v2.toString())
                } else {
                    return false
                }
            case "ILIKE":
                if (v1 instanceof String && v2 instanceof String) {
                    return v1.toLowerCase().indexOf(v2.toLowerCase()) != -1
                } else {
                    return false
                }
            case "ILIKE_S":
                if (v1 instanceof String && v2 instanceof String) {
                    return v1.toLowerCase().startsWith(v2.toLowerCase())
                } else {
                    return false
                }
            case "ILIKE_E":
                if (v1 instanceof String && v2 instanceof String) {
                    return v1.toLowerCase().endsWith(v2.toLowerCase())
                } else {
                    return false
                }
            case "IN":
                if (v1 instanceof String && v2 instanceof String) {
                    return this.compareTwoValue("LIKE", v2, v1)
                }
                if (v2 instanceof Array) {
                    if (v1 ! instanceof Array) {
                        return (<Array<any>>v2).indexOf(v1) != -1
                    } else {
                        for (let elem in v1) {
                            if (!(<Array<any>>v2).indexOf(v1)) {
                                return false
                            }
                        }
                        return true
                    }
                }
                if (v1 instanceof Map && v2 instanceof Map) {
                    if (v1.size > v2.size) {
                        return false
                    } else {
                        (<Map<any, any>>v1).forEach((v, k) => {
                            const value = (<Map<any, any>>v2).get(k)
                            if (value != k) {
                                return false
                            }
                        })
                        return true
                    }
                }
                return false
            case "NOT_IN":
                return !this.compareTwoValue("IN", v1, v2)
            case "IS_NULL":
                return v1 == null
            case "IS_NOT_NULL":
                return v1 != null
            case "IS_EMPTY":
                return v1 == ""
            case "IS_NOT_EMPTY":
                return v1 != ""
        }
    }

    private checkMod10(nums): Boolean {
        let is_valid = false;
        let check_sum = 0;

        const string_nums = nums.toString();

        // 获取校验位
        const check_digit = Number(string_nums[string_nums.length - 1]);

        /**
         * 1. 移除校验位
         * 2. 逆序排序数字
         */
        const reverse_nums = string_nums
            .slice(0, string_nums.length - 1)
            .split('')
            .map((item) => Number(item))
            .reverse();

        // 为了演示算法，增加中间变量，计数数字奇偶
        let check_offset = 2;
        for (let i = 0; i < reverse_nums.length; i++) {
            let value = reverse_nums[i];

            if (check_offset % 2 === 0) {
                value = value * 2;
                value = value > 9 ? value - 9 : value;
            }

            check_sum += value;
            ++check_offset;
        }

        const got_check_digit = 10 - (check_sum % 10);
        // console.log("got check digit", got_check_digit);

        if (got_check_digit === check_digit) {
            is_valid = true;
        }

        return is_valid;
    }

    private checkISBN10(code): Boolean {
        code = (code + '').replace(/[-\s]/g, '');
        if (!/^\d{9}[\dxX]?$/.test(code)) return;
        let i = 0, c = 0; // c:checksum
        for (; i < 9;)
            c += code.charAt(i++) * i;
        c %= 11;
        let ch = c + ''
        if (c == 10) ch = 'X';
        return c == (i = code.charAt(9)) || ch == 'X' && i + '' == 'x';
    }

    private checkISBN13(code): Boolean {
        code = (code + '').replace(/[-\s]/g, '');
        if (!/^\d{12,13}$/.test(code)) return;
        let i = 1, c = 0; // c:checksum
        for (; i < 12; i += 2)
            c += Math.floor(code.charAt(i));
        for (c *= 3, i = 0; i < 12; i += 2)
            c += Math.floor(code.charAt(i));
        c = (220 - c) % 10; // 220:大於(1*6+3*6)，%10==0即可。
        if (code.length == 12) return code + c;
        return c == code.charAt(12);
    }

    private validateSeries(type: string, step: number, values: Array<number>): Boolean {
        switch (type) {
            case "INC_DIFF": // 递增且互不相等
                let preValue: number = null
                values.forEach((value) => {
                    if (step == 0.0) { // 不应用步进
                        if (preValue >= value) {
                            return false
                        } else {
                            if (preValue + step != value) {
                                return false
                            }
                        }
                    }
                    preValue = value
                })
                return true
            case "DESC_DIFF": // 递减且互不相等
                return this.validateSeries("INC_DIFF", step, values.reverse())
            case "INC_DIFF_DESC_DIFF": // 先增后减且互不相等
                const maxValueIndex = this.maxValueIndex(values)
                if (maxValueIndex == values.length - 1) {
                    return false
                }
                const incDiffValues = values.slice(0, maxValueIndex + 1)
                const incDiffPass = this.validateSeries("INC_DIFF", step, incDiffValues)
                if (incDiffPass) {
                    const descDiffValues = values.slice(maxValueIndex, values.length)
                    return this.validateSeries("DESC_DIFF", step, descDiffValues)
                } else {
                    return false
                }
            case "DESC_DIFF_INC_DIFF": // 先减后增且互不相等
                const minValueIndex = this.minValueIndex(values)
                if (minValueIndex == values.length - 1) {
                    return false
                }
                const descDiffValues = values.slice(0, minValueIndex + 1)
                const descDiffPass = this.validateSeries("DESC_DIFF", step, descDiffValues)
                if (descDiffPass) {
                    const descDiffValues = values.slice(minValueIndex, values.length)
                    return this.validateSeries("INC_DIFF", step, descDiffValues)
                } else {
                    return false
                }
            case "DIFF": // 互不相等
                const diff = new Set(values).size == values.length
                if (!diff) {
                    return false
                } else if (step != 0.0) {
                    let preValue: number = null
                    values.forEach((value, index) => {
                        if (preValue != null) {
                            if (Math.abs(preValue - value) != step) {
                                return false
                            }
                        }
                        preValue = value
                    })
                }
                return true
            case "INC_EQ": // 递增或相等
                preValue = null
                values.forEach((value, index) => {
                    if (preValue != null) {
                        if (step == 0.0) { // 不应用步进
                            if (preValue > value) {
                                return false
                            }
                        } else {
                            if (preValue != value && preValue + step != value) {
                                return false
                            }
                        }
                    }
                    preValue = value
                })
                return true
            case "DESC_EQ": // 递减或相等
                return this.validateSeries("INC_EQ", step, values.reverse())
            case "INC_EQ_DESC_EQ": // 先递增或相等，再递减或相等
                const maxValueStartIndex = this.maxValueIndex(values)
                const maxValue = values[maxValueStartIndex]
                if (maxValueStartIndex == values.length - 1) {
                    return false
                }
                let maxValueEndIndex = maxValueStartIndex
                for (let index = maxValueStartIndex; index < values.length; index++) {
                    if (values[index] == maxValue) {
                        maxValueEndIndex = index
                    } else {
                        break
                    }
                }
                const incEqValues = values.slice(0, maxValueStartIndex + 1)
                const incEqPass = this.validateSeries("INC_EQ", step, incEqValues)
                if (incEqPass) {
                    const descEqValues = values.slice(maxValueEndIndex, values.length)
                    return this.validateSeries("DESC_EQ", step, descEqValues)
                } else {
                    return false
                }
            case "DESC_EQ_INC_EQ": // 先递减或相等，再递增或相等
                const minValueStartIndex = this.minValueIndex(values)
                const minValue = values[minValueStartIndex]
                if (minValueStartIndex == values.length - 1) {
                    return false
                }
                let minValueEndIndex = minValueStartIndex
                for (let index = minValueStartIndex; index < values.length; index++) {
                    if (values[index] == minValue) {
                        minValueEndIndex = index
                    } else {
                        break
                    }
                }
                const descEqValues = values.slice(0, minValueStartIndex + 1)
                const descEqPass = this.validateSeries("DESC_EQ", step, descEqValues)
                if (descEqPass) {
                    const incEqValues = values.slice(minValueEndIndex, values.length)
                    return this.validateSeries("INC_EQ", step, incEqValues)
                } else {
                    return false
                }
            case "EQ": // 全等
                return new Set(values).size == 1
        }


    }

    private maxValueIndex(values: Array<number>): number {
        let maxValueIndex = 0
        let maxValue = null
        values.forEach((value, index) => {
            if (maxValue == null) {
                maxValue = value
            } else {
                if (value > maxValue) {
                    maxValue = value
                    maxValueIndex = index
                }
            }
        })
        return maxValueIndex
    }

    private minValueIndex(values: Array<number>): number {
        let minValueIndex = 0
        let minValue = null
        values.forEach((value, index) => {
            if (minValue == null) {
                minValue = value
            } else {
                if (value < minValue) {
                    minValue = value
                    minValueIndex = index
                }
            }
        })
        return minValueIndex
    }

}


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
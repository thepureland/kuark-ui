import Barcoder from 'barcoder'

/**
 * 校验规则适配器，用于将服务端返回的校验规则适配为async-validator的校验规则
 *
 * @author K
 * @since 1.0.0
 */
export class ValidationRuleAdapter {

    private remoteRules: any
    private getModel: any
    private destRules: any = {}
    private trigger: string

    /**
     * 校验规则适配器的构造器
     *
     * @param remoteRules 服务端返回的校验规则的对象
     * @param getModel 用于获取待校验对象的函数
     * @param trigger 校验规则触发器
     */
    constructor(remoteRules: any, getModel: () => any, trigger = 'blur') {
        this.remoteRules = remoteRules
        this.getModel = getModel
        this.trigger = trigger
    }

    /**
     * 返回async-validator校验规则对象
     */
    getRules(): any {
        for (let propName in this.remoteRules) {
            let rules = this.remoteRules[propName]
            for (let ruleName in rules) {
                this.parseRule(ruleName, propName, rules)
            }
        }
        return this.destRules
    }

    private parseRule(ruleName: string, propName: string, rules) {
        let ruleDetails: Array<any> = rules[ruleName]
        if (!this.destRules[propName]) {
            this.destRules[propName] = []
        }
        const rule = {trigger: this.trigger}
        this.doParseRule(ruleName, propName, ruleDetails, rule)
        if (!rule["message"]) {
            rule["message"] = ruleDetails[0]["message"]
            this.destRules[propName].push(rule)
        }
    }

    private doParseRule(ruleName: string, propName: string, ruleDetails: Array<any>, rule: any) {
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
            case "Min":
                this.min(propName, ruleDetails, rule)
                break
            case "Max":
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
                this.luhnCheck(propName, ruleDetails, rule)
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
            case "Mod11Check":
                this.mod11Check(propName, ruleDetails, rule)
                break
            case "ISBN":
                this.isbn(propName, ruleDetails, rule)
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
        }
    }

    /** null约束，被校验对象可以是任何类型 */
    private null(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => value == null || value == ''
    }

    /** 非null约束，被校验对象可以是任何类型 */
    private notNull(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => value != null && value != ''
    }

    /** 非空约束, 被校验对象类型必须为以下之一：字符串、数组、集合、Map */
    private notEmpty(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => {
            return !this.isEmpty(value)
        }
    }

    /** 非空白约束，被校验对象类型必须为字符串 */
    private notBlank(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "string"
        rule["validator"] = (rule, value) => value != null && value.trim() != ""
    }

    /** 逻辑真约束，被校验对象类型必须为Boolean，且值为true，或者值为"true"的字符串 */
    private assertTrue(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => value == null || value == '' || value == true || value == "true"
    }

    /** 逻辑假约束，被校验对象类型必须为Boolean，且值为false，或者值为"false"的字符串 */
    private assertFalse(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => value == null || value == '' || value == false || value == "false"
    }

    /** 字符串代码点长度(实际字符数)约束，被校验对象类型必须为字符串 */
    private codePointLength(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "string"
        rule["validator"] = (rule, value) => {
            return value == null || value == '' || value.length >= ruleDetails[0].min && value.length <= ruleDetails[0].max
        }
    }

    /** 远程校验 */
    private remote(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["asyncValidator"] = (rule, value) => {
            return new Promise(async (resolve, reject) => {
                if (value == null || value == '') {
                    // @ts-ignore
                    resolve()
                }
                const params = {}
                params[propName] = value

                // @ts-ignore
                const result = await ajax({url: ruleDetails[0].requestUrl, params})
                if (result.code == 200) {
                    // @ts-ignore
                    resolve()
                } else {
                    reject(ruleDetails[0]["message"])
                }
            });
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
                        if (this.isDependsNotPass(depends)) {
                            return true
                        }
                    }

                    // 依赖条件不存在，或其表达式成立，再进行Compare比较逻辑
                    const anotherProperty = ruleDetail["anotherProperty"]
                    const anotherValue = this.getModel()[anotherProperty]
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
            return this.isEmpty(value) || RegExp(ruleDetails[0]["regexp"]).test(value)
        }
    }

    /** 邮箱约束，被校验对象类型必须为字符串 */
    private email(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "email"
        // 为了Each或Exists约束能取到rule["validator"]
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/
        rule["validator"] = (rule, value) => {
            return this.isEmpty(value) || value.length <= 320 && !!value.match(pattern)
        }
    }

    /** 最小值约束，被校验对象类型必须为数值 */
    private min(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => this.isEmpty(value) || value >= ruleDetails[0]["value"]
    }

    /** 最大值约束，被校验对象类型必须为数值 */
    private max(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => this.isEmpty(value) || value <= ruleDetails[0]["value"]
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
            if (this.isEmpty(value)) {
                return true
            } else {
                const inclusive = <Boolean>ruleDetails[0]["inclusive"]
                const minValue = Number(ruleDetails[0]["value"])
                return inclusive ? value >= minValue : value > minValue
            }
        }
    }

    /** 最大值约束，被校验对象类型必须为number */
    private decimalMax(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => {
            if (this.isEmpty(value)) {
                return true
            } else {
                const inclusive = <Boolean>ruleDetails[0]["inclusive"]
                const maxValue = Number(ruleDetails[0]["value"])
                return inclusive ? value <= maxValue : value < maxValue
            }
        }
    }

    /** 范围约束，被校验对象类型必须为number */
    private range(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => {
            if (this.isEmpty(value)) {
                return true
            } else {
                const minValue = Number(ruleDetails[0]["min"])
                const maxValue = Number(ruleDetails[0]["max"])
                return value >= minValue && value <= maxValue
            }
        }
    }

    /** 数值位数约束，被校验对象类型必须为number */
    private digits(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => {
            if (this.isEmpty(value)) {
                return true
            } else {
                const parts = value.toString().split(".")
                const maxIntegerDigits = Number(ruleDetails[0]["integer"])
                const minFractionDigits = Number(ruleDetails[0]["fraction"])
                const integerDigits = value <= 0 ? parts[0].length - 1 : parts[0].length
                const fractionDigits = !parts[1] ? 0 : parts[1].length
                return integerDigits <= maxIntegerDigits && fractionDigits <= minFractionDigits
            }
        }
    }

    /** 正数约束，被校验对象类型必须为number */
    private positive(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => this.isEmpty(value) || value > 0
    }

    /** 负数约束，被校验对象类型必须为number */
    private negative(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => this.isEmpty(value) || value < 0
    }

    /** 非负数约束，被校验对象类型必须为number */
    private positiveOrZero(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => this.isEmpty(value) || value >= 0
    }

    /** 非正数约束，被校验对象类型必须为number */
    private negativeOrZero(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "number"
        rule["validator"] = (rule, value) => this.isEmpty(value) || value <= 0
    }

    /** ean13条形码约束，被校验对象类型必须为number或字符串 */
    private ean(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => {
            if (this.isEmpty(value)) {
                return true
            } else {
                // const barcoder = require('barcoder');
                const type = ruleDetails[0]["type"]
                return new Barcoder.constructor(type.toLowerCase()).validate(value)
            }
        }
    }

    /** luhn约束，可检测银行卡、信用卡 */
    private luhnCheck(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => this.isEmpty(value) || this.checkMod10(value)
    }

    /** mod10约束，可检测银行卡、信用卡 */
    private mod10Check(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => this.isEmpty(value) || this.checkMod10(value)
    }

    /** mod11约束，可检测银行卡、信用卡 */
    private mod11Check(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => this.isEmpty(value) || this.checkMod11(value)
    }

    /** isbn约束 */
    private isbn(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => {
            if (this.isEmpty(value)) {
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
            if (this.isEmpty(value)) {
                return true
            } else {
                const protocol = ruleDetails[0]["protocol"]
                if (protocol && protocol != "") {
                    if (!value.trim().startsWith(protocol + "://")) {
                        return false
                    }
                }

                const host = ruleDetails[0]["host"]
                if (host && host != "") {
                    if (value.indexOf(host) == -1) {
                        return false
                    }
                }

                const port = ruleDetails[0]["port"]
                if (port && port != "" && port > 0) {
                    if (!value.endsWith(":" + port) && value.indexOf(":" + port + "/") == -1) {
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
            if (this.isEmpty(value)) {
                return true
            } else {
                const min = ruleDetails[0]["min"]
                const max = ruleDetails[0]["max"]
                if (this.isString(value) || value instanceof Array) {
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
        rule["validator"] = (rule, value) => this.isEmpty(value) || ruleDetails[0]["values"].indexOf(value) != -1
    }

    /** 数列约束，被检测的对象必须为数组或以半角逗号/空格/分号分隔的字符串 */
    private series(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => {
            if (this.isEmpty(value)) {
                return true
            } else {
                if (this.isString(value)) {
                    if (value.indexOf(",") != -1) {
                        value = value.split(",")
                    } else if(value.indexOf(";") != -1) {
                        value = value.split(";")
                    } else {
                        value = value.split(" ")
                    }
                }
                const size = ruleDetails[0]["size"]
                if (size != 0 && value.length != size) {
                    return false
                }
                if (value.length == 0 || value.length == 1) {
                    return true
                }
                return this.validateSeries(ruleDetails[0]["type"], ruleDetails[0]["step"], value)
            }
        }
    }

    /** 非null依赖约束，当前属性的值是否可以为null，取决于定义的表达式。 */
    private notNullOn(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["validator"] = (rule, value) => {
            const depends = ruleDetails[0]["depends"]
            if (this.isDependsNotPass(depends)) {
                return true
            }

            // 依赖条件不存在，或其表达式成立，再进行NotNull逻辑
            return !this.isEmpty(value)
        }
    }

    /** 对数组的每一个元素应用Constraints约束，每一个元素都校验通过才算最终通过 */
    private each(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "array"
        rule["validator"] = (rule, value: Array<any>) => {
            ruleDetails.forEach((r) => {
                for (let ruleName in r) {
                    for (let v in value) {
                        const rule = {}
                        this.doParseRule(ruleName, propName, r[ruleName], rule)
                        if (!rule["validator"](rule, v)) {
                            return false
                        }
                    }
                }
            })
            return true
        }
    }

    /** 对数组的每一个元素应用Constraints约束，只要一个元素Constraints约束校验通过就算通过 */
    private exist(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "array"
        rule["validator"] = (rule, value: Array<any>) => {
            ruleDetails.forEach((r) => {
                for (let ruleName in r) {
                    for (let v in value) {
                        const rule = {}
                        this.doParseRule(ruleName, propName, r[ruleName], rule)
                        if (rule["validator"](rule, v)) {
                            return true
                        }
                    }
                }
            })
            return false
        }
    }

    /** 惟一约束，被校验对象类型必须为数组 */
    private uniqueElements(propName: string, ruleDetails: Array<any>, rule: any) {
        rule["type"] = "array"
        rule["validator"] = (rule, value) => new Set(value).size == value.length
    }


    private isString(value: any): Boolean {
        return typeof value == 'string' || value instanceof String
    }

    private isEmpty(value: any): Boolean {
        if (value == null) {
            return true
        }
        if (typeof value == 'string' || value instanceof String) {
            return value == ''
        }
        if (value instanceof Array) {
            return value.length == 0
        }
        if (value instanceof Set || value instanceof Map) {
            return value.size == 0
        }
        return false
    }

    private isDependsNotPass(depends: any): Boolean {
        const andOr = depends["andOr"]
        const properties = <Array<string>>depends["properties"]
        const logics = <Array<string>>depends["logics"]
        const values = <Array<string>>depends["values"]
        for (let i = 0; i < properties.length; i++) {
            const property = properties[i]
            const v1 = this.getModel()[property]
            if (v1 == undefined) {
                throw new Error("指定的校验模型中不存在属性：" + property)
            }
            let v2 = null
            if (values && values.length > i) {
                v2 = values[i]
            }
            const result = this.compareTwoValue(logics[i], v1, v2)
            if (andOr) {
                if (andOr == "AND") {
                    if (!result) {
                        return true // 与逻辑时，只要一个条件不成立，depends就为false，就不需要进行外层的compare比较
                    }
                } else {
                    if (result) {
                        return false // 或逻辑时，只要一个条件成立，depends就为true，就需要外层的compare比较
                    }
                }
            } else {
                return !result
            }
        }
        return false
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
                if (this.isString(v1)) {
                    return v1.indexOf(v2.toString()) != -1
                } else {
                    return false
                }
            case "LIKE_S":
                if (this.isString(v1)) {
                    return v1.startsWith(v2.toString())
                } else {
                    return false
                }
            case "LIKE_E":
                if (this.isString(v1)) {
                    return v1.endsWith(v2.toString())
                } else {
                    return false
                }
            case "ILIKE":
                if (this.isString(v1)) {
                    return v1.toLowerCase().indexOf(v2.toLowerCase()) != -1
                } else {
                    return false
                }
            case "ILIKE_S":
                if (this.isString(v1)) {
                    return v1.toLowerCase().startsWith(v2.toLowerCase())
                } else {
                    return false
                }
            case "ILIKE_E":
                if (this.isString(v1)) {
                    return v1.toLowerCase().endsWith(v2.toLowerCase())
                } else {
                    return false
                }
            case "IN":
                if (this.isString(v1)) {
                    return this.compareTwoValue("LIKE", v2, v1)
                }
                if (v2 instanceof Array) {
                    if (v1 ! instanceof Array) {
                        return (<Array<any>>v2).indexOf(v1) != -1
                    } else {
                        for (let elem in v1) {
                            if ((<Array<any>>v2).indexOf(v1) != -1) {
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
            case "IS_EMPTY":
                return v1 == null || v1 == ''
            case "IS_NOT_NULL":
            case "IS_NOT_EMPTY":
                return v1 != null && v1 != ''
        }
    }

    private checkMod10(nums): Boolean {
        let arr = (nums + '')
            .split('')
            .reverse()
            .map(x => parseInt(x));
        let lastDigit = arr.splice(0, 1)[0];
        let sum = arr.reduce(
            (acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val *= 2) > 9 ? val - 9 : val)),
            0
        );
        sum += lastDigit;
        return sum % 10 === 0;
    }

    private checkMod11(nums): Boolean {
        let arr = (nums + '')
            .split('')
            .reverse()
            .map(x => parseInt(x));
        let lastDigit = arr.splice(0, 1)[0];
        let sum = arr.reduce(
            (acc, val, i) => (acc + (i % 6 + 2) * val), 0
        );
        const mod = sum % 11
        let checkDigit
        if (mod == 0) {
            checkDigit = 0
        } else if (mod == 1) {
            checkDigit = 'X'
        } else {
            checkDigit = 11 - mod
        }
        return checkDigit === lastDigit;
    }

    private checkISBN10(code): Boolean {
        code = (code + '').replace(/[-\s]/g, '');
        if (!/^\d{9}[\dxX]?$/.test(code)) return false;
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
        if (!/^\d{12,13}$/.test(code)) return false;
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
                for (let i = 0; i < values.length; i++) {
                    const value = Number(values[i])
                    if (preValue != null) {
                        if (step == 0.0) { // 不应用步进
                            if (preValue >= value) {
                                return false
                            }
                        } else {
                            if (preValue + step != value) {
                                return false
                            }
                        }
                    }
                    preValue = value
                }
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
                    for (let i = 0; i < values.length; i++) {
                        const value = Number(values[i])
                        if (preValue != null) {
                            if (Math.abs(preValue - value) != step) {
                                return false
                            }
                        }
                        preValue = value
                    }
                }
                return true
            case "INC_EQ": // 递增或相等
                let preV: number = null
                for (let i = 0; i < values.length; i++) {
                    const value = Number(values[i])
                    if (preV != null) {
                        if (step == 0.0) { // 不应用步进
                            if (preV > value) {
                                return false
                            }
                        } else {
                            if (preV != value && preV + step != value) {
                                return false
                            }
                        }
                    }
                    preV = value
                }
                return true
            case "DESC_EQ": // 递减或相等
                return this.validateSeries("INC_EQ", step, values.reverse())
            case "INC_EQ_DESC_EQ": // 先递增或相等，再递减或相等
                const maxValueStartIndex = this.maxValueIndex(values)
                const maxValue = values[maxValueStartIndex]
                if (maxValueStartIndex == 0 || maxValueStartIndex == values.length - 1) {
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
                if (minValueStartIndex == 0 || minValueStartIndex == values.length - 1) {
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
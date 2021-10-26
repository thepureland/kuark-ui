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

                switch (ruleName) {
                    case "Null":
                        this.null(propName, ruleDetails)
                        break
                    case "NotNull":
                        this.notNull(propName, ruleDetails)
                        break
                    case "NotEmpty":
                        this.notEmpty(propName, ruleDetails)
                        break
                    case "NotBlank":
                        this.notBlank(propName, ruleDetails)
                        break
                    case "AssertTrue":
                        this.assertTrue(propName, ruleDetails)
                        break
                    case "AssertFalse":
                        this.assertFalse(propName, ruleDetails)
                        break
                    case "CodePointLength":
                        this.codePointLength(propName, ruleDetails)
                    case "Remote":
                        this.remote(propName, ruleDetails)
                        break
                    case "Length":
                        this.length(propName, ruleDetails)
                        break
                    case "Compare":
                        this.compare(propName, ruleDetails)
                        break

                }
            }

        }
        return null
    }

    /** null约束，被校验对象可以是任何类型 */
    private null(propName: string, ruleDetails: Array<any>) {
        let rule = {}
        rule["validator"] = (rule, value) => value == null
        rule["message"] = ruleDetails[0].message
        this.destRules[propName].push(rule)
    }

    /** 非null约束，被校验对象可以是任何类型 */
    private notNull(propName: string, ruleDetails: Array<any>) {
        let rule = {}
        rule["validator"] = (rule, value) => value != null
        rule["message"] = ruleDetails[0].message
        this.destRules[propName].push(rule)
    }

    /** 非空约束, 被校验对象类型必须为以下之一：字符串、数组、列表、集合、Map */
    private notEmpty(propName: string, ruleDetails: Array<any>) {
        let rule = {}
        rule["validator"] = (rule, value) => value != null && !value.isEmpty()
        rule["message"] = ruleDetails[0].message
        this.destRules[propName].push(rule)
    }

    /** 非空白约束，被校验对象类型必须为字符串 */
    private notBlank(propName: string, ruleDetails: Array<any>) {
        let rule = {}
        rule["type"] = "string"
        rule["validator"] = (rule, value) => value != null && value.trim() != ""
        rule["message"] = ruleDetails[0].message
        this.destRules[propName].push(rule)
    }

    /** 逻辑真约束，被校验对象类型必须为Boolean，且值为true，或者值为"true"的字符串 */
    private assertTrue(propName: string, ruleDetails: Array<any>) {
        let rule = {}
        rule["validator"] = (rule, value) => value == null || value == true || value == "true"
        rule["message"] = ruleDetails[0].message
        this.destRules[propName].push(rule)
    }

    /** 逻辑假约束，被校验对象类型必须为Boolean，且值为false，或者值为"false"的字符串 */
    private assertFalse(propName: string, ruleDetails: Array<any>) {
        let rule = {}
        rule["validator"] = (rule, value) => value == null || value == false || value == "false"
        rule["message"] = ruleDetails[0].message
        this.destRules[propName].push(rule)
    }

    /** 字符串代码点长度(实际字符数)约束，被校验对象类型必须为字符串 */
    private codePointLength(propName: string, ruleDetails: Array<any>) {
        let rule = {}
        rule["type"] = "string"
        rule["validator"] = (rule, value) => {
            return value == null || value.length >= ruleDetails[0].min && value.length <= ruleDetails[0].max
        }
        rule["message"] = ruleDetails[0].message
        this.destRules[propName].push(rule)
    }

    /** 远程校验 */
    private remote(propName: string, ruleDetails: Array<any>) {
        let rule = {}
        rule["validator"] = (rule, value) => {
            // @ts-ignore
            return value == null || ajax({url: ruleDetails[0].requestUrl, params: {propName: ""}}).data
        }
        rule["message"] = ruleDetails[0].message
        this.destRules[propName].push(rule)
    }

    /** 字符串长度约束，被校验对象类型必须为字符串 */
    private length(propName: string, ruleDetails: Array<any>) {
        this.codePointLength(propName, ruleDetails)
    }

    /** 比较约束，支持数组类型，但是两个数组的大小必须一致 */
    private compare(propName: string, ruleDetails: Array<any>) {
        ruleDetails.forEach((ruleDetail)=> {
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
                        reject(ruleDetail.message)
                    } else {
                        // @ts-ignore
                        resolve()
                    }
                });
            }
            this.destRules[propName].push(rule)
        })
    }


    private compareTwoValue(logic: string, v1: any, v2: any) {
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
                        return (<Array<any>>v2).indexOf(v1)
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
(function (global) {
    //use IIFS to protect library
    const VerifyData = function (itemID, category, customMessage, extraInfo) {
        //Use VerifyData without NEW
        return new VerifyData.init(itemID, category, customMessage, extraInfo);
    }

    //create closure variable
    const supportCategory = [
        'Empty', 'Num', 'Date',
        'Positive', 'Email', 'SocialID',
        'Cellphone', 'Telphone', 'Plate',
        'Compare', 'Range', 'Custom'
    ];
    const errorMessage = [
        '必填', '只能填入數字', '日期格式不符',
        '只能填入正整數', '信箱格式不符', '身分證格式不符',
        '手機號碼格式不符', '號碼格式不符', '車牌格式不符',
        '比對失敗', '超出範圍', '格式不符'
    ];
    const rangeType = ['Date', 'Num'];
    let rangeMax, rangeMin;
    let verifyResult;

    VerifyData.prototype = {
        //VerifyData prototype
        validate: function () {
            // check item exist and category support
            let exception = '';
            if (!global.document.getElementById(this.itemID)) {
                exception = ' Invaild Item';
            }

            if (supportCategory.indexOf(this.category) === -1) {
                exception += ' Invaild Category ';
            }

            if (exception != '') {
                throw exception;
            }
        },
        verify: function (category) {
            const value = this.value;
            let result = true;
            let dtRegex;

            switch (category) {
                case 'Empty':
                    if (value == "") {
                        // format error
                        result = false;
                    }
                    break;
                case 'Num':
                    dtRegex = new RegExp(/^\d+/);
                    if (!dtRegex.test(value) || isNaN(value)) {
                        // format error
                        result = false;
                    }
                    break;
                case 'Date':
                    dtRegex = new RegExp(/^(\d{4})[\/|\-](\d{1,2})[\/|\-](\d{1,2}){1}$/);
                    if (!dtRegex.test(value)) {
                        // format error
                        result = false;
                    } else {
                        // overflow error
                        const inputdate = dtRegex.exec(value),
                            inputday = new Date(value);

                        if (inputday.getFullYear() != inputdate[1] || (inputday.getMonth() + 1) != inputdate[2] || inputday.getDate() != inputdate[3]) {
                            result = false;
                        }
                    }
                    break;
                case 'Positive':
                    dtRegex = new RegExp(/^\+?\d\d*$/);
                    if (!dtRegex.test(value)) {
                        // format error
                        result = false;
                    }
                    break;
                case 'Email':
                    dtRegex = new RegExp(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/);
                    if (!dtRegex.test(value)) {
                        // format error
                        result = false;
                    }
                    break;
                case 'SocialID':
                    dtRegex = new RegExp(/[a-zA-Z]{1}\d{9}/);
                    if (!dtRegex.test(value)) {
                        // format error
                        result = false;
                    }
                    break;
                case 'Cellphone':
                    dtRegex = new RegExp(/(^09\d{8})|(^\+(\d{12}|\d{3}\s\d{9}))/);
                    if (!dtRegex.test(value)) {
                        // format error
                        result = false;
                    }
                    break;
                case 'Telphone':
                    dtRegex = new RegExp(/^03((\-|\s){0,1}\d{7})/);
                    if (!dtRegex.test(value)) {
                        // format error
                        result = false;
                    }
                    break;
                case 'Plate':
                    dtRegex = new RegExp(/([a-zA-Z]{2,3}|\d{2,3})\-([a-zA-Z]{2,4}|\d{2,4})/);
                    if (!dtRegex.test(value)) {
                        // format error
                        result = false;
                    }
                    break;
                case 'Compare':
                    //extraInfo as item2
                    const item2 = global.document.getElementById(this.extraInfo);
                    if (item.value != item2.value) {
                        // format error
                        result = false;
                    }
                    break;
                case 'Range':
                    //extraInfo as type
                    if (extraInfo == 'Date') {
                        const userValue = new Date(value),
                            maxDate = new Date(max),
                            minDate = new Date(min);

                        if (maxDate < userValue || userValue < minDate) {
                            result = false;
                        }
                    } else if ((extraInfo == 'Num')) {
                        const userValue = parseInt(value),
                            max = parseInt(max),
                            min = parseInt(min);

                        if (max < userValue || userValue < min) {
                            result = false;
                        }
                    }
                    break;
                case 'Custom':
                    dtRegex = new RegExp(extraInfo);
                    if (!dtRegex.test(value)) {
                        // format error
                        result = false;
                    }
                    break;
                default:
                    break;
            }
            this.verifyResult = result;
        },
        verifyData: function () {
            //verify data and return result
            this.validate();

            const item = global.document.getElementById(this.itemID);
            item.addEventListener('change', function () {
                this.verify(this.category);
            }, false);

            return this;
        },
        showResult: function () {
            //show verify result
            return this.verifyResult;
        },
        showMessage: function () {
            //show error message
            let result = "";

            const categoryid = supportCategory.indexOf(this.category);
            result = this.customMessage !== '' ? this.customMessage : errorMessage[categoryid];

            return result;
        },
        showUserInput: function () {
            //show user input
            let item = global.document.getElementById(this.itemID);

            return item.value;
        },
        setItem: function (itemID, category) {
            //Set item ID and verify category
            this.itemID = itemID;
            this.category = category;

            this.validate();

            return this;
        },
        setMessage: function (message) {
            //set custom message
            this.customMessage = message;
            return this;
        },
        setCompare: function (item2ID) {
            //set compare item
            if (global.document.getElementById(item2ID)) {
                throw "Invaild Item";
            }

            this.extraInfo = item2ID;

            return this;
        },
        setRange: function (type, max, min) {
            //set range type、max、min
            if (this.rangeType.indexOf(type) === -1) {
                throw "Invaild type";
            }

            this.extraInfo = type;
            this.max = max;
            this.min = min;

            return this;
        },
        setCustom: function (dtRegex) {
            //set custom verify method
            this.extraInfo = dtRegex;

            return this;
        }
    };

    VerifyData.init = function (itemID, category, customMessage, extraInfo) {
        const self = this; //Prevent Use this

        self.itemID = itemID || '';
        self.category = category || 'Empty';
        self.customMessage = customMessage || '';
        self.extraInfo = extraInfo || '';

    }

    VerifyData.init.prototype = VerifyData.prototype; //Save prototype

    global.VerifyData = global.VD$ = VerifyData; //use VD$() or VerifyData to Create

})(window);
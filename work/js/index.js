/******************************************************************************
 * 全局配置
 *****************************************************************************/
var global = {};
global.host = "http://139.196.38.189:8033";
global.CONST_VAL = {
    LENGTH_OF_LEASE: 24,
    FLOATING: 0.05
}
global.to_server = {};



var tpl = {
    price: function(n) {
        return "<span class='number'>" + (isNaN(n)?0:n).toFixed(2) + "</span>元";
    },
    area: function(n) {
        return "面积：<span class='text'>" + (isNaN(n)?0:n).toFixed(0) + "</span>m²";
    },
    plan: function(n) {
        return "方案：<span class='text'>" + n + "</span>";
    },
    subitem: function(opt) {
        return "<div class='subitem " + opt.classname + "'>\
                <span class='title'>" + opt.title + "</span>\
                <span class='plan'>" + opt.plan + "</span>\
                <span class='area'>" + opt.area + "</span>\
                <span class='price'>" + opt.price + "</span>\
                <hr>\
                <div class='itemdetail misc'>" + (opt.misc || "") + "</div>\
                <div class='clear'></div>\
            </div>";
    },
    rooms: {
        toilet: function() {
            return '<div class="form-group form-group-lg col-xs-12 col-sm-6 col-md-4" id="toilet-2">\
                <label class="control-label">次卫</label>\
                <div class="input-group"><input type="number" class="form-control" id="area-toilet-2">\
                <div class="input-group-addon">m²</div></div></div>';
        },
        bedroom_2nd: function() {
            return '<div class="form-group form-group-lg col-xs-12 col-sm-6 col-md-4" id="bedroom-2">\
                <label class="control-label">次卧</label>\
                <div class="input-group"><input type="number" class="form-control" id="area-bedroom-2">\
                <div class="input-group-addon">m²</div></div></div>';
        },
        bedroom_3rd: function() {
            return '<div class="form-group form-group-lg col-xs-12 col-sm-6 col-md-4" id="bedroom-3">\
                <label class="control-label">次卧</label>\
                <div class="input-group"><input type="number" class="form-control" id="area-bedroom-3">\
                <div class="input-group-addon">m²</div></div></div>';
        },
        livingroom: function() {
            return '<div class="form-group form-group-lg col-xs-12 col-sm-6 col-md-4" id="livingroom-2">\
                <label class="control-label">客厅</label>\
                <div class="input-group"><input type="number" class="form-control" id="area-livingroom-2">\
                <div class="input-group-addon">m²</div></div></div>';
        }
    }
};



/******************************************************************************
 * 数据模型
 *****************************************************************************/
var cache_init = {
    planId: "",
    salesman: {
        name: "",
        phone: ""
    },
    area: {
        kitchen_1: 0,
        toilet_1: 0,
        bedroom_1: 0,
        livingroom_1: 0
    },
    kitchen: {
        selected_index: -1,
        plan: ""
    },
    bedroom: {
        selected_index: -1,
        plan: ""
    },
    livingroom: {
        selected_index: -1,
        plan: ""
    },
    softloading: {
        selected_index: -1,
        plan: ""
    },
    linen: {
        selected_index: 0,
        plan: ""
    }
};

var fill_cache_checks = function() {
    cache.check = cache.check || {};
    $('input[type="checkbox"]').each(function() {
        if ($(this).attr('statustype') && $(this).attr('id')) {
            cache.check[$(this).attr('statustype')] = cache.check[$(this).attr('statustype')] || {};
            cache.check[$(this).attr('statustype')][$(this).attr('id')] = $(this).prop('checked');
        }
    });
    // console.log(cache.check);
}

var fill_cache_area = function() {
    cache.area.kitchen_1 = $('#area-kitchen-1').val() || 0;
    cache.area.kitchen = cache.area.kitchen_1 * 1;

    cache.area.toilet_1 = $('#area-toilet-1').val() || 0;
    cache.area.toilet_2 = $('#area-toilet-2').val() || 0;
    cache.area.toilet = cache.area.toilet_1 * 1 + cache.area.toilet_2 * 1;

    cache.area.bedroom_1 = $('#area-bedroom-1').val() || 0;
    cache.area.bedroom_2 = $('#area-bedroom-2').val() || 0;
    cache.area.bedroom_3 = $('#area-bedroom-3').val() || 0;
    cache.area.bedroom = cache.area.bedroom_1 * 1 + cache.area.bedroom_2 * 1 + cache.area.bedroom_3 * 1;

    cache.area.livingroom_1 = $('#area-livingroom-1').val() || 0;
    cache.area.livingroom_2 = $('#area-livingroom-2').val() || 0;
    cache.area.livingroom = cache.area.livingroom_1 * 1 + cache.area.livingroom_2 * 1;
};

var prices = {
    repaire: {
        model: 'repaire',
        name: '修补',
        toilet: 300,
        kitchen: 300,
        bedroom: 300,
        livingroom: 300,
        softloading: 300,
        linen: 100,
        plan: {
            toilet: "清洗洁具，清洗地砖。",
            kitchen: "修补煤气灶，清洁橱柜，疏通清洁下水道，换灯管。",
            bedroom: "更换坏地板，地坪修补，阳台修补。",
            softloading: "橱柜保养，床垫保养，电器维修，空调换水。",
            linen: "花草养护，鱼缸清洗，更换挂饰。"
        }
    },
    simply: {
        model: 'simply',
        name: '简装',
        toilet: 800,
        kitchen: 800,
        bedroom: 400,
        livingroom: 400,
        softloading: 400,
        linen: 135,
        plan: {
            toilet: "更换台盆，更换卫浴，更换洁具。",
            kitchen: "更换灶台，更换橱柜面板及台面。",
            bedroom: "更换照明灯具，翻新墙面，更换家具。",
            softloading: "更换床头柜，更换更衣橱，安置各种电器。",
            linen: "阳台花草布置，更换挂饰。"
        }
    },
    finely: {
        model: 'finely',
        name: '精装',
        toilet: 1600,
        kitchen: 1600,
        bedroom: 400,
        livingroom: 400,
        softloading: 600,
        linen: 150,
        plan: {
            toilet: "更换全套卫浴洁具，安装大浴缸，日本马桶圈。",
            kitchen: "更换全套橱柜灶具，更换水斗，重做落水。",
            bedroom: "更换大床，墙面修补，地板修补，重做阳台。",
            softloading: "更换全套家具，安置各种电器。",
            linen: "阳台花草，挂饰小器具，咖啡机，音响，书橱，鞋柜。"
        }
    }
};

var lease_floating = {
    away_from_subway: {
        1: 6,  // 15分钟以上
        2: 0,  // 10分钟以上
        3: -6 // 5分钟以上
    },
    building_region: {
        1: 4,  // 外环以外
        2: 2,  // 中环-外环以内
        3: 0,  // 内环-中环以内
        4: -2  // 内环以内        
    },
    trading_area: {
        1: 0,  // 有商圈
        2: 2   // 无商圈
    },
    build_type: {    
        1: 0,    // 公寓
        2: 2     // 老公房
    },
    renttype: {
        1: 0,    // 合租
        2: 0,    // 整租
        3: 0     // 整栋
    }
}

var plan_details = {
    simply: [{
        name: '厨房',
        items: [{ name: '水槽龙头更换', brand: '美仕达' },
            { name: '下水管更换', brand: '潜水艇' },
            { name: '三角阀更换', brand: '九牧' },
            { name: '金属软管更换', brand: '九牧' },
            { name: '开关插座面板更换', brand: '西门子' },
            { name: '吸顶灯更换', brand: '欧普' },
            { name: 'PVC吊顶', brand: '' },
            { name: '料理台门板翻新', brand: '模压门板' },
            { name: '料理台台面翻新', brand: '石英石' },
            { name: '木门油漆翻新', brand: '紫荆花' }
        ]
    }, {
        name: '卫生间',
        items: [{ name: '淋浴龙头更换', brand: '美仕达、乐家' },
            { name: '台盆龙头更换', brand: '美仕达、乐家' },
            { name: '台盆下水更换', brand: '潜水艇' },
            { name: '三角阀更换', brand: '九牧' },
            { name: '坐便器更换', brand: '卡思诺、乐家' },
            { name: '吸顶灯更换', brand: '欧普' },
            { name: '开关插座面板更换', brand: '西门子远景' },
            { name: '金属软管更换', brand: '' }
        ]
    }, {
        name: '卧室+餐厅',
        items: [{ name: '顶面旧粉层铲除', brand: '' },
            { name: '墙面旧粉层铲除', brand: '' },
            { name: '顶面修补刷涂料', brand: '多乐士超易洗' },
            { name: '墙面修补刷涂料', brand: '多乐士超易洗' },
            { name: '开关插座面板更换', brand: '西门子远景' },
            { name: '木门套翻新油漆', brand: '' },
            { name: '整体深度保洁', brand: '' }
        ]
    }, {
        name: '生活电器',
        items: [{ name: '产品名称', brand: '品牌' },
            { name: '燃气热水器', brand: '美的' },
            { name: '油烟机', brand: '樱花' },
            { name: '燃气灶', brand: '樱花' },
            { name: '空调', brand: '松下' },
            { name: '冰箱', brand: '三星科技' },
            { name: '洗衣机', brand: '小天鹅' },
            { name: '电视机', brand: '先锋' },
            { name: '电磁炉', brand: '美的' },
            { name: '电热水器', brand: '万和' },
            { name: '浴霸', brand: '欧普' }
        ]
    }],
    finely: [{
        name: '水电',
        items: [{ name: '整体拆旧' },
            { name: '非砼墙面PVC电管敷设（含开槽、铺管）' },
            { name: 'PVC电管明装（涉及不开槽地面或顶面）' },
            { name: '管槽修粉' },
            { name: '电管内穿阻燃电线1.5mm', brand: '起帆' },
            { name: '电管内穿阻燃电线2.5mm', brand: '起帆' },
            { name: '电管内穿阻燃电线4.0mm', brand: '起帆' },
            { name: '电管内穿电话线', brand: '安普' },
            { name: '电管内穿电视线', brand: '安普' },
            { name: '电管内穿网络线', brand: '安普' },
            { name: '更换强电箱及漏电保护器', brand: 'ABB' },
            { name: '更换弱电箱', brand: '德力西' },
            { name: 'PPR水管安装25mm', brand: '皮尔萨' }
        ]
    }, {
        name: '门窗',
        items: [{ name: '封门头/门上梁' },
            { name: '套装门细木工板基层' },
            { name: '门洞修补' },
            { name: '防盗门安装', brand: '星月神' }
        ]
    }, {
        name: '油漆',
        items: [{ name: '墙面贴布防裂处理' },
            { name: '墙面滚涂胶水', brand: '中南' },
            { name: '墙顶面批嵌腻子', brand: '嘉宝莉' },
            { name: '墙顶面乳胶漆涂刷', brand: '多乐士超易洗' }
        ]
    }, {
        name: '墙地面',
        items: [{ name: '墙面铺贴墙砖', brand: '宾仕' },
            { name: '地砖铺贴', brand: '宾仕' },
            { name: '专用勾缝剂', brand: '牛元' },
            { name: '木基层安装石膏板', brand: '泰山' },
            { name: '轻钢龙骨石膏板隔墙' },
            { name: '强化地板铺设', brand: '扬子' },
            { name: '人造大理石挡水条铺设' }
        ]
    }, {
        name: '顶面',
        items: [{ name: '木龙骨石膏板吊平顶', brand: '泰山' },
            { name: '铝扣板集成吊顶', brand: '狮龙' },
            { name: 'PVC铝扣板吊顶', brand: '浪花' }
        ]
    }, {
        name: '安装',
        items: [{ name: '水槽龙头', brand: '外岡' },
            { name: '不锈钢水槽', brand: '翠贝卡' },
            { name: '下水管', brand: '潜水艇' },
            { name: '三角阀更换', brand: '九牧' },
            { name: '金属软管更换', brand: '潜水艇' },
            { name: '坐便器安装', brand: '蓝鲸、卡思诺' },
            { name: '立盆龙头', brand: '美仕达、乐家' },
            { name: '立盆安装', brand: '蓝鲸、卡思诺' },
            { name: '淋浴龙头', brand: '美仕达、乐家' },
            { name: '开关面板', brand: '西门子' },
            { name: '橱柜定制', brand: '优嘉' },
            { name: '人造石台面', brand: '金伯利' },
            { name: '防臭地漏', brand: '九牧' },
            { name: '深度保洁' }
        ]
    }, {
        name: '生活电器',
        items: [{ name: '产品名称', brand: '品牌', model: '型号' },
            { name: '燃气热水器', brand: '美的', model: '10QF3' },
            { name: '油烟机', brand: '樱花', model: 'X11-3' },
            { name: '燃气灶', brand: '樱花', model: 'Y02' },
            { name: '空调', brand: '松下', model: '1.5匹' },
            { name: '冰箱', brand: '三星科技', model: 'BCD-88' },
            { name: '洗衣机', brand: '小天鹅', model: '2155系列' },
            { name: '电视机', brand: '先锋', model: '39寸' },
            { name: '电磁炉', brand: '美的', model: 'HK2002' },
            { name: '电热水器', brand: '万和', model: '40升' },
            { name: '浴霸', brand: '欧普', model: '灯暖' }
        ]
    }],
    repaire: [{
        name: '厨房',
        items: [{ name: '水槽龙头更换', brand: '美仕达' },
            { name: '下水管更换', brand: '潜水艇' },
            { name: '三角阀更换' },
            { name: '金属软管更换' },
            { name: '开关插座面板更换', brand: '西门子' },
            { name: '吸顶灯更换' },
            { name: 'PVC吊顶/铝扣板吊顶' },
            { name: '料理台门板翻新', brand: '模压门板' },
            { name: '料理台台面翻新', brand: '博康石英石' },
            { name: '木门油漆翻新', brand: '紫荆花' }
        ]
    }, {
        name: '卫生间',
        items: [{ name: '淋浴龙头更换', brand: '美仕达、乐家' },
            { name: '台盆龙头更换', brand: '美仕达、乐家' },
            { name: '台盆下水更换', brand: '潜水艇' },
            { name: '三角阀更换' },
            { name: '坐便器更换', brand: '卡思诺、乐家' },
            { name: '浴霸', brand: '欧普' },
            { name: '吸顶灯更换', brand: '欧普' },
            { name: '开关插座面板更换', brand: '西门子远景' },
            { name: '金属软管更换' }
        ]
    }, {
        name: '卧室+餐厅',
        items: [{ name: '顶面修补刷涂料', brand: '多乐士净味全效' },
            { name: '墙面修补刷涂料', brand: '多乐士净味全效' },
            { name: '开关插座面板更换', brand: '西门子远景' },
            { name: '整体保洁' },
            { name: '木门套翻新油漆', brand: '紫荆花' }
        ]
    }, {
        name: '生活电器',
        items: [{ name: '燃气热水器', brand: '美的', model: '10QF3' },
            { name: '油烟机', brand: '樱花', model: 'X11-3' },
            { name: '燃气灶', brand: '樱花', model: 'Y02' },
            { name: '空调', brand: '松下', model: '1.5匹' },
            { name: '冰箱', brand: '三星科技', model: 'BCD-88' },
            { name: '洗衣机', brand: '小天鹅', model: '2155系列' },
            { name: '电视机', brand: '先锋', model: '39寸' },
            { name: '电磁炉', brand: '美的', model: 'HK2002' },
            { name: '电热水器', brand: '万和', model: '40升' }
        ]
    }]
};

// 返回按建筑面积，计算各个套餐的装修总价
var getPrices = function() {
    var roomrate = $('#room-rate').val() * 1 / 100;
    var area = {
        toilet: (cache.area.toilet / roomrate).toFixed(2),
        kitchen: (cache.area.kitchen / roomrate).toFixed(2),
        bedroom: (cache.area.bedroom / roomrate).toFixed(2),
        livingroom: (cache.area.livingroom / roomrate).toFixed(2),
        softloading: ((cache.area.bedroom + cache.area.livingroom) / roomrate).toFixed(2)
    };
    cache.building_area = area;

    var get_model_price = function (model, area) {
        var result = {};
            result.toilet = area.toilet * prices[model].toilet;
            result.kitchen = area.kitchen * prices[model].kitchen;
            result.bedroom = area.bedroom * prices[model].bedroom;
            result.livingroom = area.livingroom * prices[model].livingroom;
            result.softloading = area.softloading * prices[model].softloading;
            result.linen = area.softloading * prices[model].linen;
            result.plan = prices[model].plan;
            result.model = prices[model].model;
            result.name = prices[model].name;

        if (cache.check && cache.check.price && 
                cache.check.price.hardloading_partition_wall) {
            result.softloading += 3000;
            if (area.livingroom > 0) {
                result.livingroom += 3000;
            } else {
                result.bedroom += 3000;
            }
        }
        if (cache.check && cache.check.price && 
                cache.check.price.hardloading_break_wall) {
            result.bedroom += 1500;
        }

        result.total = result.toilet + result.kitchen + result.bedroom + result.livingroom + result.softloading;
        result.total_with_linen = result.total + result.linen;
        return result;
    }
    return [
        get_model_price('repaire', area),
        get_model_price('simply', area),
        get_model_price('finely', area),
    ];
}

var getDecorateCost = function(offset) {
    var lease = global.CONST_VAL.LENGTH_OF_LEASE + (offset||0);

    // 根据房屋状态浮动租赁长度
    lease += lease_floating[ $('#away_from_subway').attr('id') ][ $('#away_from_subway').val() ] || 0;
    lease += lease_floating[ $('#building_region').attr('id') ][ $('#building_region').val() ] || 0;
    lease += lease_floating[ $('#trading_area').attr('id') ][ $('#trading_area').val() ] || 0;
    console.log('浮动后月数：%s', lease);

    global.to_server = global.to_server || {};
    global.to_server.lease = lease;
    return ($('#max_rent').val() * 1 - $('#min_rent').val() * 1) * lease;
}



/******************************************************************************
 * 通用函数
 *****************************************************************************/
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
var uuid4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
}
var uuid8 = function() {
    return uuid4() + uuid4();
}
var uuid16 = function() {
    return uuid8() + uuid8();
}
var uuid32 = function() {
    return uuid16() + uuid16();
}
var uuid = function() {
    return uuid4() + uuid4() + '-' + uuid4() + '-' + uuid4() + '-' +
        uuid4() + '-' + uuid4() + uuid4() + uuid4();
}
$.fn.style_model_active = function() {
    return $(this).each(function(index, obj) {
        var bind_key = $(this).attr('bind');
        $(obj).find('.style-selectable').on('click', function() {
            if ($(this).hasClass('style-selected')) {
                cache[bind_key].selected_index = -1;
                cache[bind_key].unit_price = 0;
                cache[bind_key].plan = "";
                $(this).removeClass('style-selected');
            } else {
                cache[bind_key].selected_index = $(this).index();
                cache[bind_key].unit_price = $(this).attr('unitprice') * 1;
                cache[bind_key].plan = $(this).attr('plan');
                $(this).addClass('style-selected').siblings().removeClass('style-selected');
            }
        });
    });
};
$.fn.style_model_render = function() {
    return $(this).each(function(i, obj) {
        var bind_key = $(this).attr('bind');
        var index = cache[bind_key].selected_index + 1;
        $(this).find('.style-model:nth-child(' + index + ')').addClass('style-selected');
    });
};
$.fn.area_model_active = function() {
    return $(this).each(function(index, obj) {
        var bind_key = $(this).attr('bind');
        $(obj).on('change', function() {
            cache.area[bind_key] = $(this).val() * 1;
        }).on('click', function() {});
    })
};
$.fn.area_model_render = function() {
    return $(this).each(function(index, obj) {
        var bind_key = $(this).attr('bind');
        $(this).val("-1" == cache.area[bind_key] ? "" : cache.area[bind_key]);
    })
};
$.fn.turnClass = function(classname, trueorfalse) {
    return $(this).each(function(index, obj) {
        (trueorfalse) ? $(obj).addClass(classname): $(obj).removeClass(classname);
    })
};
$.fn.step_bar_status = function() {
    return $(this).each(function(index, obj) {
        $(obj).find('.steps.step-area').turnClass('completed', area.isCompleted());
        $(obj).find('.steps.step-kitchen').turnClass('completed', kitchen.isCompleted());
        $(obj).find('.steps.step-bedroom').turnClass('completed', bedroom.isCompleted());
        $(obj).find('.steps.step-livingroom').turnClass('completed', livingroom.isCompleted());
        $(obj).find('.steps.step-softloading').turnClass('completed', softloading.isCompleted());
        $(obj).find('.steps.step-linen').turnClass('completed', linen.isCompleted());
    })
}
var load_salesman_from_localstorage = function() {
    if (localStorage && localStorage.getItem("salesman")) {
        cache.salesman = JSON.parse(localStorage.getItem("salesman"));
    }
}
var new_cache = function() {
    return $.extend(true, {}, cache_init);
}

// usage: global.jsonform = form_serialize( $('.jsonform') );
var form_serialize = function ($wrap) {
    var result = [];
    $wrap.find('input, select').each(function () {
        var obj = $(this), pkg = {};

        switch (obj[0].nodeName + (obj.attr('type')||"")) {
            case "INPUTnumber":
                pkg = {
                    name: "number",
                    id: obj.attr('id'),
                    value: obj.val()
                };
                break;
            case "INPUTcheckbox":
                pkg = {
                    name: "checkbox",
                    id: obj.attr('id'),
                    prop: obj.prop("checked")
                };
                break;
            case "SELECT":
                pkg = {
                    name: "select",
                    id: obj.attr('id'),
                    value: obj.val()
                };
                break;
        };
        result.push(pkg);
    })
    return result;
}





/**************************************************
 * 模板加载 
 * https://github.com/progrape/router
 **************************************************/
var cache = new_cache();

var router = new Router({
    container: '#container',
    enterTimeout: 250,
    leaveTimeout: 250
});

// 登录，用户是谁
var login = {
    url: '/login',
    className: 'login',
    render: function() {
        return $('#tpl_login').html();
    },
    bind: function() {

        // 取 localStorage salesman
        load_salesman_from_localstorage();
        $(".login-name").val(cache.salesman.name);
        $(".login-phone").val(cache.salesman.phone);

        $(".js-login").on('click', function() {
            // 存 localStorage salesman
            localStorage.setItem("salesman", JSON.stringify({
                name: $(".login-name").val(),
                phone: $(".login-phone").val()
            }));

            location.href = "#/home";
        });
    }
};

// 首页，选择几大入口
var home = {
    url: '/home',
    className: 'home',
    render: function() {
        return $('#tpl_home').html();
    },
    bind: function() {
        cache = new_cache();
        cache.planId = uuid8();
        load_salesman_from_localstorage();
    }
};



var required_can_pass = function () {

    var pass = true;
    $('.req-ele').each(function () {
        var obj = $(this);

        switch (obj[0].nodeName + (obj.attr('type')||"")) {
            case "INPUTnumber":
                if ("" === obj.val()) { // 未填写
                    obj.closest(".req").addClass("error");
                    obj.on('change', function () {
                        obj.closest(".req").removeClass("error");
                    });
                    pass = false;
                }
                break;
            case "INPUTcheckbox":
                if (!obj.prop("checked")) { // 未选中
                    obj.closest(".req").addClass("error");
                    obj.on('click', function () {
                        obj.closest(".req").removeClass("error");
                    });
                    pass = false;
                }
                break;
            case "SELECT":
                if ("" === obj.val()) { // 未选择
                    obj.addClass("error");
                    obj.on('change', function () {
                        obj.removeClass("error");
                    });
                    pass = false;
                }
                break;
        }

    });    
    return pass;
}

var step_texts = function(step) {
    switch (true) {
        case (step <= 3):
            return "正在请求连接数据中心...";
        case (step <= 13):
            return "数据中心已接入，提交报价信息并进行初步评估...";
        case (step <= 23):
            return "筛选优质套餐匹配信息，正在进行排序梳理...";
        case (step <= 27):
            return "整理完毕，正在生成方案汇报...";
        case (28 == step):
            return "方案生成完毕";
        default:
            return "处理中...";
    }

}
var agent_run = function(prices, decost) {

    global.current_plan = "";
    global.current_offer = {};
    decost = decost * (1 + global.CONST_VAL.FLOATING);

    console.log('price: %s %s %s, cost: %s',
        prices[0].total, prices[1].total, prices[2].total, decost);

    // cache.check
    // "check": {
    //     "price": {
    //         "has_occluder": false,               // 周边有重大遮挡物
    //         "has_water_damage": false,           // 房间为泡水房
    //         "hardloading_break_wall": false,     // 包含拆除
    //         "hardloading_partition_wall": false  // 需要打隔断
    //     }
    // }

    if (decost > prices[2].total) {
        global.current_plan = prices[2].name;
        global.current_model = prices[2].model;
        global.current_offer = prices[2];
    } else if (decost > prices[1].total) {
        global.current_plan = prices[1].name;
        global.current_model = prices[1].model;
        global.current_offer = prices[1];
    } else if (decost > prices[0].total
            // && !cache.check.price.has_water_damage // 泡水房只能精装或简装
            // && !cache.check.price.hardloading_break_wall // 敲墙只能精装或简装
            // && !cache.check.price.hardloading_partition_wall // 打隔断只能精装或简装
        ) {
        global.current_plan = prices[0].name;
        global.current_model = prices[0].model;
        global.current_offer = prices[0];
    } else {
        global.current_plan = "不建议收房";
        global.current_model = "";
        global.current_offer = {};
    }
    // console.log(global.current_plan);
    // console.log(global.current_offer);

    agent_animate();
}

var agent_animate = function () {

    var intt = 0,
        last_step = 28;

    for (var i = 1; i <= last_step; i++) {
        setTimeout(function(step) {
            $('.weui_dialog_title').text(step_texts(step));
            $('.agent-progress').width((100 / last_step * step) + '%');
            if (last_step == step) {
                $('.dialog-agent-close').text('点击查看').on('click', function() {
                    $('.dialog-agent-close').off('click');
                    $('#dialog-agent-running').fadeOut(function() {
                        $('.dialog-agent-close').off('click');
                        $('.agent-progress').width(0);
						
                        location.href = "#/pick_offer";
                    });
                });

            }
        }, i * 200, i);
    }
}




// 装修方案助手
var decorateagent = {
    url: '/decorateagent',
    className: 'decorate_agent',
    render: function() {
        return $('#tpl_decorate_agent').html();
    },
    bind: function() {

        // 增加次卧、次卫、客厅
        var add_room = function() {
        	console.info("改变了")
            var add_which_room = $('#add-room').val();
            $('#add-room').val("0");

            switch (add_which_room) {
                case "toilet":
                    if ($("#toilet-2").length > 0) return;
                    $("#rooms #add-room-wrap").before(tpl.rooms.toilet);
                    break;
                case "bedroom":
                    if ($("#bedroom-3").length > 0) return;

                    if ($("#bedroom-2").length > 0) {
                        $("#rooms #add-room-wrap").before(tpl.rooms.bedroom_3rd);
                    } else {
                        $("#rooms #add-room-wrap").before(tpl.rooms.bedroom_2nd);
                    }

                    break;
                case "livingroom":
                    if ($("#livingroom-2").length > 0) return;
                    $("#rooms #add-room-wrap").before(tpl.rooms.livingroom);
                    break;
            }
        }

        var slider = $('#rangeSlider');
        if (slider[0]) {
            noUiSlider.create(slider[0], {
                start: 80,
                range: { 'min': 70, 'max': 100 }
            });
            slider[0].noUiSlider.on('update', function(e) {
                $('#room-rate').val(Math.round(e));
            });
        }

        $('.btn-agent-run').on('click', function() {

            $('.not-pass').hide();

            if ( !required_can_pass() ) {
                $('.not-pass').show();
                return false;
            }

            // 通过表单验证，缓存整个表单
            global.jsonform = form_serialize( $('.jsonform') );

            $('.dialog-agent-close').text('处理中...');

            fill_cache_area();
            fill_cache_checks();

            $('#dialog-agent-running').fadeIn('fast', function() {
               $('.dialog-agent-close').off('click');
               agent_run(getPrices(), getDecorateCost());
            });
        });

        $('#add-room').on('change', function() {
            add_room();
        })

        $('.from-area-jumpto-home').on('click', function() {
            $('.page-container').fadeOut(function() {
                location.href = "#/home";
            });
        });


    }
}

// 面积
var area = {
    url: '/area',
    className: 'area',
    render: function() {
        return $('#tpl_area').html();
    },
    bind: function() {
        $('.from-area-jumpto-home').on('click', function() {
            $('.area-form, .step-bar').fadeOut(function() {
                location.href = "#/home";
            });
        });
        $('.from-area-jumpto-next').on('click', function() {
            console.log("input fading out")
            $('.area-form input').fadeOut("fast");
        });
        $('.area-form input').area_model_render().area_model_active();
        $('.step-bar').step_bar_status();
    },
    isCompleted: function() {
        return -1 != cache.area.kitchen_1 && "" != cache.area.kitchen_1 &&
            -1 != cache.area.toilet_1 && "" != cache.area.toilet_1 &&
            -1 != cache.area.bedroom_1 && "" != cache.area.bedroom_1;
    }
};

// 厨卫
var kitchen = {
    url: '/kitchen',
    className: 'kitchen',
    render: function() {
        return $('#tpl_kitchen').html();
    },
    bind: function() {
        var swiper_picker = new Swiper('.swiper-style-picker', {
            pagination: '.swiper-pagination',
            slidesPerView: 4,
            paginationClickable: true,
            spaceBetween: 30
        });
        $('.swiper-style-picker').style_model_render().style_model_active();
        $('.step-bar').step_bar_status();
    },
    isCompleted: function() {
        return -1 != cache.kitchen.selected_index;
    },
    getPrice: function() {
        var price = {
            kitchen: 0,
            toilet: 0,
            total: 0
        };
        if (cache.area.kitchen_1 && cache.kitchen.selected_index >= 0) {
            price.kitchen = cache.area.kitchen_1 * cache.kitchen.unit_price;
        }
        if (cache.area.toilet_1 && cache.kitchen.selected_index >= 0) {
            price.toilet = cache.area.toilet_1 * cache.kitchen.unit_price;
        }
        price.total = price.kitchen + price.toilet;
        return price;
    }
};

// 卧室
var bedroom = {
    url: '/bedroom',
    className: 'bedroom',
    render: function() {
        return $('#tpl_bedroom').html();
    },
    bind: function() {
        var swiper_picker = new Swiper('.swiper-style-picker', {
            pagination: '.swiper-pagination',
            slidesPerView: 4,
            paginationClickable: true,
            spaceBetween: 30
        });
        $('.swiper-style-picker').style_model_render().style_model_active();
        $('.step-bar').step_bar_status();

        $('.swiper-style-picker').find('.style-selectable').on('click', function() {
            // onClick事件触发在addClass之前，所以没有selected时其实是将要选中，有selected时是将要取消
            if (!$(this).hasClass('style-selected')) {
                cache.bedroom.softloading_price = 0;
            } else {
                cache.bedroom.softloading_price = $(this).attr('softloading') * 1;
            }
        });

    },
    isCompleted: function() {
        return -1 != cache.bedroom.selected_index;
    },
    getPrice: function() {
        if (cache.area.bedroom_1 && cache.bedroom.selected_index >= 0) {
            return cache.area.bedroom_1 * cache.bedroom.unit_price;
        } else {
            return 0;
        }
    }
};

// 客厅
var livingroom = {
    url: '/livingroom',
    className: 'livingroom',
    render: function() {
        return $('#tpl_livingroom').html();
    },
    bind: function() {
        var swiper_picker = new Swiper('.swiper-style-picker', {
            pagination: '.swiper-pagination',
            slidesPerView: 4,
            paginationClickable: true,
            spaceBetween: 30
        });
        $('.swiper-style-picker').style_model_render().style_model_active();
        $('.step-bar').step_bar_status();
    },
    getPrice: function() {
        return 0;
    },
    isCompleted: function() {
        return -1 != cache.livingroom.selected_index;
    }
};

// 布草
var linen = {
    url: '/linen',
    className: 'linen',
    render: function() {
        return $('#tpl_linen').html();
    },
    bind: function() {
        var swiper_picker = new Swiper('.swiper-style-picker', {
            pagination: '.swiper-pagination',
            slidesPerView: 4,
            paginationClickable: true,
            spaceBetween: 30
        });
        $('.swiper-style-picker').style_model_render().style_model_active();
        $('.step-bar').step_bar_status();
    },
    isCompleted: function() {
        return -1 != cache.linen.selected_index;
    },
    getPrice: function() {
        return linen_price[cache.bedroom.selected_index];
    }
};

// 软装
var softloading = {
    url: '/softloading',
    className: 'softloading',
    render: function() {
        return $('#tpl_softloading').html();
    },
    bind: function() {
        var swiper_picker = new Swiper('.swiper-style-picker', {
            pagination: '.swiper-pagination',
            slidesPerView: 4,
            paginationClickable: true,
            spaceBetween: 30
        });
        $('.tg-popup1').on('click', function(e) {
            e.preventDefault();
            $('.popup1').fadeIn();
            var fullscreen = new Swiper('.popup1', {});
            return false;
        });
        $('.tg-popup2').on('click', function(e) {
            e.preventDefault();
            $('.popup2').fadeIn();
            var fullscreen = new Swiper('.popup2', {});
            return false;
        });

        $('.s-popup').on('click', function() {
            $(this).fadeOut();
        })
        $('.swiper-style-picker').style_model_render().style_model_active();
        $('.step-bar').step_bar_status();
    },
    isCompleted: function() {
        return -1 != cache.softloading.selected_index;
    },
    getPrice: function() {
        if (cache.area.bedroom_1 && cache.bedroom.selected_index >= 0) {
            return cache.area.bedroom_1 * cache.bedroom.softloading_price;
        } else {
            return 0;
        }
    }
};


// 报价
var offer = {
    url: '/offer',
    className: 'offer',
    render: function() {
        return $('#tpl_offer').html();
    },
    bind: function() {
        // $('.step-bar').step_bar_status();

        // // cache = JSON.parse('{"planId":"","salesman":{"name":"虫子","phone":"18121256138"},"area":{"kitchen":3,"toilet":3,"bedroom":22,"livingroom":-1},"kitchen":{"selected_index":1,"unit_price":800,"plan":"简装"},"bedroom":{"selected_index":1,"unit_price":300,"softloading_price":300,"plan":"简装"},"livingroom":{"selected_index":1,"unit_price":0,"plan":"简装"},"softloading":{"selected_index":0,"unit_price":0,"plan":"深沉"},"linen":{"selected_index":1,"unit_price":0,"plan":"B套布草风格"}}');

        // if (area.isCompleted() && kitchen.isCompleted() && bedroom.isCompleted()) {
        //     // 该填的都填完了

        //     $('.hardloading .price').html(tpl.price(kitchen.getPrice().total + bedroom.getPrice()));
        //     $('.softloading .price').html(tpl.price(softloading.getPrice()));
        //     $('.linen .price').html(tpl.price(linen.getPrice()));

        //     var subitems = [];

        //     subitems.push(tpl.subitem({
        //         title: "厨房",
        //         classname: "kitchen",
        //         price: tpl.price(kitchen.getPrice().kitchen),
        //         area: tpl.area(cache.area.kitchen_1),
        //         plan: tpl.plan(cache.kitchen.plan)
        //     }));
        //     subitems.push(tpl.subitem({
        //         title: "卫生间",
        //         classname: "toilet",
        //         price: tpl.price(kitchen.getPrice().toilet),
        //         area: tpl.area(cache.area.toilet_1),
        //         plan: tpl.plan(cache.kitchen.plan)
        //     }));
        //     subitems.push(tpl.subitem({
        //         title: "卧室",
        //         classname: "bedroom",
        //         price: tpl.price(bedroom.getPrice()),
        //         area: tpl.area(cache.area.bedroom_1),
        //         plan: tpl.plan(cache.bedroom.plan)
        //     }));

        //     $('.subitems').html(subitems.join(""));

        //     // $('.hardloading .price').html( tpl.price() )

        //     var total_price = kitchen.getPrice().total + bedroom.getPrice() + softloading.getPrice() + linen.getPrice();
        //     $('.total .price').html(tpl.price(total_price));

        //     var plan_string = "厨卫：" + cache.kitchen.plan + "，" +
        //         "卧室：" + cache.bedroom.plan + "，" +
        //         "客厅：" + (cache.livingroom.plan || "不需要") + "，" +
        //         "软装：" + (cache.softloading.plan || "不需要") + "，" +
        //         "布草：" + (cache.linen.plan || "不需要") + "。";

        //     // 取 localStorage salesman
        //     load_salesman_from_localstorage();

        //     $('.js-offer-post').on('click', function() {
        //         cache.planId = uuid();

        //         var data = {
        //             planId: cache.planId,
        //             area_kitchen: cache.area.kitchen_1,
        //             area_toilet: cache.area.toilet_1,
        //             area_bedroom: cache.area.bedroom_1,
        //             area_livingroom: cache.area.livingroom_1,
        //             price_kitchen: kitchen.getPrice().kitchen,
        //             price_toilet: kitchen.getPrice().toilet,
        //             price_bedroom: bedroom.getPrice(),
        //             price_livingroom: livingroom.getPrice(),
        //             price_softloading: cache.softloading.selected_index,
        //             price_total: total_price,
        //             salesman_name: cache.salesman.name,
        //             salesman_phone: cache.salesman.phone,
        //             style: plan_string
        //         };

        //         console.log(JSON.stringify(data));

        //         $(this).addClass("disabled").text('发送中...');
        //         $.ajax({
        //             url: global.host + "/plan",
        //             type: "post",
        //             data: data,
        //             timeout: 3000,
        //             success: function(result) {
        //                 console.log(JSON.stringify(result));
        //             },
        //             error: function() {},
        //             complete: function() {
        //                 $('.js-offer-post').removeClass("disabled").text('提交成功');
        //                 location.href = "#/offer_posted";
        //             }
        //         })

            // });

            $('.offer-mask').hide();
        // }
    }
};

// 订单提交成功
var offer_posted = {
    url: '/offer_posted',
    className: 'offer_posted',
    render: function() {
        return $('#tpl_offer_posted').html();
    }
};

// 客户信息
var customer = {
    url: '/customer',
    className: 'customer',
    render: function() {
        return $('#tpl_customer').html();
    },
    bind: function() {
        $('.js-customer-post').on('click', function() {
            var data = {
                planId: cache.planId,
                customer_name: $('#customer-name').val(),
                customer_phone: $('#customer-phone').val(),
                customer_memo: $('#customer-memo').val(),
            };

            $(this).addClass("disabled").text('发送中...');
            $.ajax({
                url: global.host + "/customer",
                type: "post",
                data: data,
                timeout: 3000,
                success: function(result) {
                    console.log(JSON.stringify(result));
                },
                error: function() {},
                complete: function() {
                    $('.js-customer-post').removeClass("disabled").text('提交成功');

                    location.href = "#/home";
                }
            })
        });
    }
};



// 二维码分享
var qrcode = {
    url: '/qrcode',
    className: 'qrcode',
    render: function() {
        return $('#tpl_qrcode').html();
    },
    bind: function () {
        var path = "/shared/plan";
        var salesman_phone = "18121256138";
        var customer_phone = "13677754321";
        var planId = "5c9950f0";

        var url = global.host + path + "/" + planId + "/" + salesman_phone + "/" + customer_phone;
        console.log(url);

        var qrcode = new QRCode($("#qrcode")[0], {
            width : 300,
            height : 300
        });

        $('#href').val(url);
        qrcode.makeCode(url);

    }
};



// 案例列表
var caselist = {
    url: '/caselist',
    className: 'caselist',
    render: function() {
        return $('#tpl_caselist').html();
    },
    bind: function() {

        $('.caselist-btns').on('click', function(e) {
            e.preventDefault();
            var popup = '.' + $(this).attr('ref');
            $(popup).fadeIn();
            var fullscreen = new Swiper(popup, {});
            return false;
        });
        $('.s-popup').on('click', function() {
            $(this).fadeOut();
        })
    }
};

// 案例详情
var casedetail = {
    url: '/casedetail',
    className: 'casedetail',
    render: function() {
        return $('#tpl_casedetail').html();
    }
};


// 报价
var pick_offer = {
    url: '/pick_offer',
    className: 'offer',
    render: function() {
        return $('#tpl_pick_offer').html();
    },
    bind: function() {
        var make_style = function () {
            var result = global.current_plan+"；";
            result += "样式 "+cache.fashion_name+"；";
            result += "厨 "+cache.area.kitchen+"平，";
            result += "卫 "+cache.area.toilet+"平，";
            result += "卧 "+cache.area.bedroom+"平，";
            result += "客 "+cache.area.livingroom+"平；";
            result += "方案价格：" + global.current_offer.total + "元；";
            result += "含布草总价：" + global.current_offer.total_with_linen + "元";
            return result;
        }

        var subitems = [];
// global.current_offer = JSON.parse('{"toilet":3000,"kitchen":3000,"bedroom":9000,"livingroom":0,"softloading":9000,"linen":3037.5,"plan":{"toilet":"更换台盆，更换卫浴，更换洁具。","kitchen":"更换灶台，更换橱柜面板及台面。","bedroom":"更换照明灯具，翻新墙面，更换家具。","softloading":"更换床头柜，更换更衣橱，安置各种电器。","linen":"阳台花草布置，更换挂饰。"},"total":24000,"total_with_linen":27037.5}');
// global.current_plan = "简装";
// cache = JSON.parse('{"planId":"","salesman":{"name":"虫子","phone":"18121256138"},"area":{"kitchen_1":"3","toilet_1":"3","bedroom_1":"18","livingroom_1":0,"kitchen":3,"toilet_2":0,"toilet":3,"bedroom_2":0,"bedroom_3":0,"bedroom":18,"livingroom_2":0,"livingroom":0},"kitchen":{"selected_index":-1,"plan":""},"bedroom":{"selected_index":-1,"plan":""},"livingroom":{"selected_index":-1,"plan":""},"softloading":{"selected_index":-1,"plan":""},"linen":{"selected_index":0,"plan":""},"check":{"fashions":{"fashion_a":false,"fashion_b":true,"fashion_c":true},"required":{"locker_and_meter":true,"rent_and_service":true,"has_floor_plan":false},"price":{"has_occluder":false,"has_water_damage":false,"hardloading_break_wall":false,"hardloading_partition_wall":false},"keep":{"keep_aircon":false,"keep_washer":false,"keep_fridge":false},"rules":{"take_photo":true,"shoot_video":true}},"building_area":{"toilet":"3.75","kitchen":"3.75","bedroom":"22.50","livingroom":"0.00","softloading":"22.50"},"fashion":"fashion_b"}');
console.log(JSON.stringify(global.current_offer));
console.log(JSON.stringify(cache));

        // 取 localStorage salesman
        load_salesman_from_localstorage();

        $('.js-offer-post').on('click', function () {
            if (!cache.fashion) {
                console.log("no fashion picked!");
                return false;
            }

            cache.planId = uuid8();
            cache.global = global.to_server;

            var data = {
                planId: cache.planId,
                style: make_style() || "",
                salesman_name: cache.salesman.name,
                salesman_phone: cache.salesman.phone,
                cachestr: JSON.stringify(cache),
                costr: JSON.stringify(global.current_offer),
                fromstr: JSON.stringify(global.jsonform),
            };

            console.log(JSON.stringify(data));

            $(this).addClass("disabled").text('发送中...');
            var ajax_options = {
                url: global.host + "/plan",
                type: "post",
                data: data,
                timeout: 3000,
                success: function (result) {
                    console.log(JSON.stringify(result));
                },
                error: function () {
                },
                complete: function () {
                    $('.js-offer-post').removeClass("disabled").text('提交成功');
                    location.href = "#/offer_posted";
                }
            };
            $.ajax(ajax_options);
        });

        
        if (!global.current_offer || !global.current_offer.total) {
        // 不建议收房
            console.log(global.current_plan);
            return;
        }
        if (!global.current_plan) {
        // 致命错误
            console.log('error');
            return;
        }

        
        // 按勾选的风格及对应的报价出装修方案
        var co = global.current_offer;
        var cp = global.current_plan;
        global.to_server.plan = cp;

        $('.hardloading .price').html(tpl.price(co.bedroom + co.kitchen + co.toilet + co.livingroom));
        $('.softloading .price').html(tpl.price(co.softloading));
        $('.linen .price').html(tpl.price(co.linen));

        $('.softloading .subdetail').text(co.plan.softloading);
        $('.linen .subdetail').text(co.plan.linen);

        if (co.kitchen && co.kitchen > 0) {
            subitems.push( tpl.subitem({
                    title: "厨房",
                    classname: "kitchen",
                    price: tpl.price( co.kitchen ),
                    plan: tpl.plan( cp ),
                    area: tpl.area( cache.area.kitchen ),
                    misc: co.plan.kitchen
            }));
        }
        if (co.toilet && co.toilet > 0) {
            subitems.push( tpl.subitem({
                    title: "卫生间",
                    classname: "toilet",
                    price: tpl.price( co.toilet ),
                    plan: tpl.plan( cp ),
                    area: tpl.area( cache.area.toilet ),
                    misc: co.plan.toilet
            }));
        }
        if (co.bedroom && co.bedroom > 0) {
            subitems.push( tpl.subitem({
                    title: "卧室",
                    classname: "bedroom",
                    price: tpl.price( co.bedroom ),
                    plan: tpl.plan( cp ),
                    area: tpl.area( cache.area.bedroom ),
                    misc: co.plan.bedroom
            }));
        }
        if (co.livingroom && co.livingroom > 0) {
            subitems.push( tpl.subitem({
                    title: "客厅",
                    classname: "livingroom",
                    price: tpl.price( co.livingroom ),
                    plan: tpl.plan( cp ),
                    area: tpl.area( cache.area.livingroom ),
                    misc: co.plan.livingroom
            }));
        }
        $('.subitems').html(subitems.join(""));
        $('.total .price').html(tpl.price(co.total_with_linen));

        // 风格选择
        if (cache.check.fashions.fashion_f) {
            $('#fashion_f_panel').show().addClass('selected').siblings().removeClass('selected');
        }
        if (cache.check.fashions.fashion_e) {
            $('#fashion_e_panel').show().addClass('selected').siblings().removeClass('selected');
        }
        if (cache.check.fashions.fashion_d) {
            $('#fashion_d_panel').show().addClass('selected').siblings().removeClass('selected');
        }
        if (cache.check.fashions.fashion_c) {
            $('#fashion_c_panel').show().addClass('selected').siblings().removeClass('selected');
        }
        if (cache.check.fashions.fashion_b) {
            $('#fashion_b_panel').show().addClass('selected').siblings().removeClass('selected');
        }
        if (cache.check.fashions.fashion_a) {
            $('#fashion_a_panel').show().addClass('selected').siblings().removeClass('selected');
        }
        cache.fashion = $('.fashion.selected').attr("id");
        cache.fashion_name = $('.fashion.selected').attr("name");

        $('.fashion').on('click', function () {
            $(this).addClass('selected').siblings().removeClass('selected');
            cache.fashion = $(this).attr("id");
            cache.fashion_name = $(this).attr("name");
        });

    }

};

// 报价记录
var offerlist = {
    url: '/offerlist',
    className: 'offerlist',
    render: function() {
        return $('#tpl_offerlist').html();
    },
    bind: function() {

        var el = function(opt) {
                return "";
            },
            myoffer = $('table#myoffer');

        load_salesman_from_localstorage();

        if (!cache.salesman.phone) {

        } else {
                // <tr>
                //     <td>2017-01-08 16:43</td>
                //     <td>邬老板</td>
                //     <td>136777654321</td>
                //     <td>叨逼叨叨逼叨叨逼叨叨逼叨叨逼叨，叨逼叨叨逼叨叨逼</td>
                // </tr>

            var tbody = [];
            $.get(global.host + "/self/plans/" + cache.salesman.phone, function(result) {
                result.rows.forEach(function (row) {
                    tbody.push("<tr>\
                            <td class='createdAt'>"+(new Date(row.createdAt)).Format("MM-dd hh:mm")+"</td>\
                            <td class='salesman_name'>"+(row.customer_name||"尚未填写")+"</td>\
                            <td class='salesman_phone'>"+(row.customer_phone||"尚未填写")+"</td>\
                            <td class='plan'>"+row.style+"</td>\
                        </tr>");
                });
                myoffer.find('tbody').html( tbody.join("") );
            });

        }
    }
};

// 报价细节
var plan_detail = {
    url: '/plan_detail',
    className: 'plan_detail',
    render: function() {
        return $('#tpl_plan_detail').html();
    },
    bind: function() {
        var tpl = {
            wrap: function (inner) {
                return '<div class="detail-wrap">'+inner+'</div>';
            },
            head: function (text) {
                return '<h2>'+text+'</h2>';
            },
            detail: function (shtml) {
                return '<table class="detail"><thead><tr><td class="pname">施工项目</td>\
<td class="pbrand">品牌</td></tr></thead>\
<tbody>'+shtml+'</tbody></table>';
            },
            row: function (obj) {
                return '<tr><td class="pname">'+obj.name+'</td>\
<td class="pbrand">'+(obj.brand||"")+(obj.model||"")+'</td></tr>';
            }
        };

        if (global.current_model) {
            var details = plan_details[global.current_model],
                stable = [];
            details.forEach(function (detail) {
                var rows = [];
                detail.items.forEach(function (row) {
                    rows.push( tpl.row( row ) );
                });
                stable.push( tpl.wrap( tpl.head(detail.name) + tpl.detail(rows.join('')) ) );
            });

            $('.list').html(stable.join(''));
        } else {

        }
    }
};

router.push(login)
    .push(home)
    .push(decorateagent)
    .push(area)
    .push(kitchen)
    .push(bedroom)
    .push(livingroom)
    .push(linen)
    .push(softloading)
    .push(offer)
    .push(pick_offer)
    .push(offer_posted)
    .push(customer)
    .push(caselist)
    .push(casedetail)
    .push(offerlist)
    .push(qrcode)
    .push(plan_detail)

.setDefault('/login')
    .init();




// .container 设置了 overflow 属性, 导致 Android 手机下输入框获取焦点时, 输入法挡住输入框的 bug
// 相关 issue: https://github.com/weui/weui/issues/15
// 解决方法:
// 0. .container 去掉 overflow 属性, 但此 demo 下会引发别的问题
// 1. 参考 http://stackoverflow.com/questions/23757345/android-does-not-correctly-scroll-on-input-focus-if-not-body-element
//    Android 手机下, input 或 textarea 元素聚焦时, 主动滚一把
if (/Android/gi.test(navigator.userAgent)) {
    window.addEventListener('resize', function() {
        if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
            window.setTimeout(function() {
                document.activeElement.scrollIntoViewIfNeeded();
            }, 0);
        }
    })
}

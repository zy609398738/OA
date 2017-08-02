var app = require("../../../modules/supports/webpack-dev-web-test");

app.start({}, function(app){	
	app.get('/user-icons/:filename', function (req, res) {
		var path = require('path');
		var mainDir = path.dirname(require.main.filename);
        var filePath = path.join(mainDir+"/web-test/user-icons", req.params.filename);
        console.log(">>> Client request file: " + filePath + " ...", new Date());
        res.sendFile(filePath);
    });

    app.post('/im-service/identity.json', function(req, resp) {
    	var data = {
	    	 userCode: "boke-test-001",
	         userName: "测试用户1",
	         userIcon: "/user-icons/01.png",
	         userToken: "dev-mode-test-token:boke-test-001"
		};
        console.log(">>> Client request 'identity' ...", new Date());
        resp.send(JSON.stringify(data));
    });

    app.post('/im-service/userinfo.json', function(req, resp) {
    	var data = {
			"boke-test-001": {
  		         name: "测试用户1",
   		         icon: "/user-icons/01.png",
   			},
			"boke-test-002": {
 		         name: "测试用户2",
		         icon: "/user-icons/02.png",
			},
			"boke-test-003": {
 		         name: "测试用户3",
		         //icon: "/user-icons/03.png",
			},
			"boke-test-004": {
 		         name: "测试用户4",
		         icon: "/user-icons/04.png",
			},
			"boke-test-005": {
 		         name: "测试用户5-上海博科资讯股份有限公司",
		         //icon: "/user-icons/05.png",
			},
			"boke-test-006": {
 		         name: "测试用户6-上海博科资讯股份有限公司",
		         icon: "/user-icons/06.png",
			},
			"boke-test-007": {
 		         name: "测试用户7",
		         icon: "/user-icons/07.png",
			}
		};
        console.log(">>> Client request 'userinfo' ...", req.body, new Date());
        resp.send(JSON.stringify(data));
    });

    //注意: 用户 003 不存在于 buddies 数据中
    app.post('/im-service/buddies.json', function(req, resp) {
    	var data = [{
		      groupName: "VIP 客户",
			  groupType:"normal",
		      users: [{
			         code: "boke-test-002",
			         name: "测试用户2",
			         icon: "/user-icons/02.png"
		      }, {
			         code: "boke-test-004",
			         name: "测试用户4",
			         icon: "/user-icons/04.png"
		      }]
		}, {
		      groupName: "普通客户",
			  groupType:"normal",
		      users: [{
			         code: "boke-test-005",
			         name: "测试用户5-上海博科资讯股份有限公司",
			         //icon: "/user-icons/05.png"
		      }, {
			         code: "boke-test-007",
			         name: "测试用户7",
			         icon: "/user-icons/07.png"
		      }]
		}, {
		      groupName: "潜在客户",
			  groupType:"normal",
		      users: [{
			         code: "boke-test-006",
			         name: "测试用户6-上海博科资讯股份有限公司",
			         icon: "/user-icons/06.png"
		      }, {
			         code: "boke-test-008",
			         name: "测试用户8",
			         icon: null
		      }]
		}, {
		      groupName: "更多测试",
			  groupType:"normal",
		      users: [{
			         code: "boke-test-011",
			         name: "测试用户11-上海博科资讯股份有限公司",
			         icon: null
		      }, {
			         code: "boke-test-012",
			         name: "测试用户12",
			         icon: null
		      }, {
			         code: "boke-test-013",
			         name: "测试用户13",
			         icon: null
		      }, {
			         code: "boke-test-014",
			         name: "测试用户14",
			         icon: null
		      }, {
			         code: "boke-test-015",
			         name: "测试用户15",
			         icon: null
		      }, {
			         code: "boke-test-016",
			         name: "测试用户16",
			         icon: null
		      }, {
			         code: "boke-test-017",
			         name: "测试用户17",
			         icon: null
		      }, {
			         code: "boke-test-018",
			         name: "测试用户18",
			         icon: null
		      }, {
			         code: "boke-test-019",
			         name: "测试用户19",
			         icon: null
		      }, {
			         code: "boke-test-020",
			         name: "测试用户20",
			         icon: null
		      }]
		},{
			groupName: "黑名单",
			groupType:"blacklist",
			users: [{
				code: "boke-test-009",
				name: "测试用户9",
				icon: null
			}, {
				code: "boke-test-010",
				name: "测试用户10",
				icon: null
			}]
		}];
        console.log(">>> Client request 'buddies' ...", req.body, new Date());
        resp.send(JSON.stringify(data));
    });
});

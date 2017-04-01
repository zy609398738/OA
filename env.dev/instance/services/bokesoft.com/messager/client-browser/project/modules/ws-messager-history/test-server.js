var app = require("../../../modules/supports/webpack-dev-web-test");

app.start({httpPort:8088}, function(app){

    app.get('/user-icons/:filename', function (req, res) {
        var path = require('path');
        var mainDir = path.dirname(require.main.filename);
        var filePath = path.join(mainDir+"/web-test/user-icons", req.params.filename);
        res.sendFile(filePath);
    });

    app.post('/im-service/groups.json', function(req, resp) {
        var data = [ 
			{groupCode:"group-001",groupName: "普通客户1"},
			{groupCode:"group-002",groupName: "VIP 客户2"},
			{groupCode:"group-003",groupName: "普通客户3"},
			{groupCode:"group-004",groupName: "普通客户4"},
			{groupCode:"group-005",groupName: "普通客户5"}
		];
        resp.send(JSON.stringify(data));
    });
	
    app.post('/im-service/users.json', function(req, resp) {
        var data = [{
                code: "boke-test-001",
                name: "测试用户1",
                icon: "/user-icons/01.png"
            }, {
                code: "boke-test-002",
                name: "测试用户2",
                icon: "/user-icons/01.png"
            }, {
                code: "boke-test-003",
                name: "测试用户3",
                icon: "/user-icons/01.png"
            }];
        resp.send(JSON.stringify(data));
    });

    app.post('/im-service/dtls.json', function(req, resp) {

        var testdata={
            pageNo:0,
            pageSize:10,
            totalRecords:200,
            pageCount:20,
            data: [
                {
                    date:"2016-8-22",
                    messageinfos:[{
                        code: "boke-test-001",
                        sender: "测试用户3",
                        type: "TEXT",
                        timestamp: "11:00:00",
                        message:"测试消息内容0301"
                    },{
                        code: "boke-test-001",
                        sender: "测试用户3",
                        type: "TEXT",
                        timestamp: "11:00:02",
                        message:"测试消息内容0302"
                    }]
                },
                {
                    date:"2016-8-23",
                    messageinfos:[{
                        code: "boke-test-002",
                        sender: "测试用户4",
                        type: "TEXT",
                        timestamp: "11:00:05",
                        message:"测试消息内容0401"
                    },{
                        code: "boke-test-002",
                        sender: "测试用户4",
                        type: "TEXT",
                        timestamp: "11:00:08",
                        message:"测试消息内容0402"
                    }]
                }
            ]
        };


        resp.send(JSON.stringify(testdata));
    });
});

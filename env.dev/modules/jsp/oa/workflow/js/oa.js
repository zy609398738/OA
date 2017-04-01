var MAP_C_SERVICE = MAP_C_SERVICE || (function() {
    var matches = /^\/(\w+)\/?/.exec(decodeURI(location.pathname));
    return (matches && matches[1]) ? matches[1] : null;
})();

var MAP_C_SERVER_URL = MAP_C_SERVER_URL || (location.protocol + '//' + location.host + '/' + MAP_C_SERVICE);
var appCtx; // same as MAP_C_SERVICE

void function(jq) {
    var $window = jq(window);
    var $workspace, $top, $left, $bottom, $right, $center;

    var wsWidth = 1004, wsHeight = 768;
    $window.resize(function(){
        $workspace || ($workspace = jq('#workspace'));
        $top || ($top = jq('#top'));
        $left || ($left = jq('#aside_left'));
        $bottom || ($bottom = jq('#bottom'));
        $right || ($right = jq('#sub_aside_right'));
        $center || ($center = jq('#mid_center'));
		//$todolist || ($todolist = jq('#doc-todo-list'));

        wsWidth = Math.max(1004, $window.innerWidth(), $top.outerWidth() || 0) - ($left.outerWidth() || 0) - 26;
        //wsWidth = $workspace.innerWidth();
        wsHeight = Math.max($window.innerHeight() - $workspace.offset().top - ($bottom.outerHeight(true) || 0), ($left.innerHeight() || 0));

        //$workspace.width(wsWidth);
        //$left.height(wsHeight-8);
		//$workspace.height(wsHeight-8);

		
        $workspace.find('#bill_content, #ws_content').each(function(){
            $workspace.css('height', 'auto');
            var $this = jq(this),
                $parent = $this.parentsUntil($workspace),
                $siblings = $parent.exists() ? $parent.siblings(':visible') : $this.siblings(':visible');

            $this.css('height', 'auto');

            var wSiblings = 0, hSiblings = 0;
            $siblings.each(function() {
                var $sibling = jq(this);
                if (!/^(relative|static)$/.test($sibling.css('position'))) return;

                hSiblings += $sibling.outerHeight();
            });
            //$this.width(wsWidth - wSiblings - 0);
        });

        $workspace.find('.doc-list').each(function(){
            $workspace.height(wsHeight);
            var $this = jq(this),
                $parent = $this.parentsUntil($workspace),
                $siblings = $parent.exists() ? $parent.siblings(':visible') : $this.siblings(':visible');
            var wSiblings = 0, hSiblings = 0;
            $siblings.each(function() {
                var $sibling = jq(this);
                if (!/^(relative|static)$/.test($sibling.css('position'))) return;

                hSiblings += $sibling.outerHeight();
                //wSiblings += $sibling.outerWidth();
            });
            //$this.height(wsHeight - hSiblings - 8).width(wsWidth - wSiblings - 0);
        });

        //$center.width(wsWidth-$right.width()-10);
        //jq("#mid_center .news .span6").width(($center.width()-10)/2);
    });

    jq(function(){
        appCtx = jq('#application-ctx').val() || '';

        // 未登录或登录超时， 弹出登录小窗
        jq.ajaxSetup({
            statusCode: {
                /*401: function(*//*XMLHttpRequest*//*xhr){ // HTTPjqUNAUTHORIZED
                    jq.fancybox.open({
                        modal: true,
                        type: 'ajax',
                        href: 'includes/login_form.jsp'
                    });
                },*/
                500: function(){
                    alert('系统加载内容失败，请检查程序配置');
                }
            },
            cache: false
        });

        jq('body').ajaxSend(function(evt, xhr, options){
            var opts = options || {};
            if (!('target' in opts) || !opts.target){
                return;
            }
            jq(opts.target).html(jq('#loading-mask').html());
        });

		$window.trigger('resize');

        var onWorkspaceContentLoad = function(){
            $window.trigger('resize');
            jq.triggerOfDefaultElementIn($workspace)();
        };
		
		// 单独打开某页面的入口。如：approval/documents_todo.jsp，通过jsp_utilities.jsp中
		// redirectOnNonAjaxRequest方法处理成approval/index.jsp?_preload=approval/documents_todo.jsp
        if (!/index\.jsp$/i.test(location.pathname)) {
            $workspace.load((location.pathname + location.search)/*.addUrlParam({
                w : $workspace.innerWidth() - 8,
                h : $workspace.innerHeight() - 8
            })*/, onWorkspaceContentLoad);
        }

        // 加载 [href] 到 #workspace
        jq.fn.loadToWorkspace = function(){
            return this.off('click').click(function(evt){
                jq.fancybox.close(true);
				if (YIGO_BillContext && 
					YIGO_BillContext.getBillViewer() && 
					YIGO_BillContext.getBillViewer().billForm &&
					YIGO_BillContext.getBillViewer().billForm.billFormModel.__readOnly) {
					try {
						YIGO.clearAllContext();
					}catch(e){}

					$workspace.load(jq(this).attr('href')/*.addUrlParam({
						w : $workspace.innerWidth() - 8,
						h : $workspace.innerHeight() - 8
					})*/, onWorkspaceContentLoad);

					jq(this).activeMenuItem();
				} else {
					if (confirm("当前处于编辑状态，是否要放弃编辑")) {
						try {
							YIGO.clearAllContext();
						}catch(e){}

						$workspace.load(jq(this).attr('href')/*.addUrlParam({
							w : $workspace.innerWidth() - 8,
							h : $workspace.innerHeight() - 8
						})*/, onWorkspaceContentLoad);

						jq(this).activeMenuItem();
					}
				}
                return evt.preventDefault() && false;
            });
        };

        // 加载 [href]?data('ajax-params') 或 提交关联表单 data('form-rel')
        //   到 [ajax-target].
        jq.fn.loadToTarget = function() {
            return this.off('click').click(function(evt) {
                var $this = jq(this),
                    href = $this.attr('href').addUrlParam($this.data('ajax-params')), // 参数同样要给form
                    formRel = $this.data('form-rel'),
                    target = $this.data('ajax-target');
                jq.fancybox.close(true);
                $this.activeMenuItem($workspace);

				try {
				  YIGO.clearAllContext();
				}catch(e){console.log(e.stack);}
				
                formRel ?
                    jq(formRel).attr('action', href).submit() :
                    jq(target).load(href, jq.triggerOfDefaultElementIn(target));

                return evt.preventDefault() && false;
            });
        };

        function logout() {
            jq.post(
                MAP_C_SERVER_URL + '/rfc.do?__web=1&__out=1&&logout=1',
                {__webCall:'WebLogout', __webParaCount: 0, _method: 'post'},
                function(ret){
                    if ( true == ret) {
                        top.location.href = "login.jsp";
                    }
                },
                'json'
            );
        }

        jq('#logout').click(function(evt){
            window.confirm("提示：您是否确定退出?") && logout();

            return evt.preventDefault() && false;
        });

        jq('.lib_tab').each(function(){
            var $tabCt = jq(this),
                $tabHeader = $tabCt.find('.tab_head li[data-tab-panel]'),
                $tabContent = $tabCt.find('.tab_item');

            $tabHeader.mouseover(function(){
                var $tab = jq(this), tabContentId = $tab.data('tab-panel');
                $tabHeader.removeClass('hover');
                $tab.addClass('hover');

                $tabContent.hide();
                $tabCt.find(tabContentId).show();
                
                jq('.fl_right').find('form').each(function(){jq(this).hide()})
                jq('.fl_right .'+$tab.data('tab-panel').replace('#','')).show();
            });
        });
		
		// 加在首页待办
		$($('.index-ajax-load').attr('target')).load($('.index-ajax-load').attr('href'));
		
        // 向 workspace 容器 ajax加载内容的链接
        jq('.ws-load[href]').loadToWorkspace();

        // 向指定容器 ajax加载内容的链接
        jq('.ajax-load[href]').loadToTarget();
        
        // 隐性的ajax表单提交
        jq('.imply-submit').click(function(evt){
            var $this = jq(this),
                form = $this.data('form'),
                $form = form ? jq(form) : jq(this).closest('form');

            $form.submit();
            return !$this.is('a') || (evt.preventDefault() && false);
        });

        jq('#form-todo-x-filter-index').ajaxForm({
            target: '#doc-todo-list'
        }).submit();
        
        jq('#form-toread-x-filter-index').ajaxForm({
        	target: '#doc-toread_list'
        }).submit();

        jq('.collapse-toggle').click(function(evt){
            var $this = jq(this),
                collapsibleElement = $this.data('el-rel'),
                $collapsibleElement = collapsibleElement ? jq(collapsibleElement):
                    $this.next(':first');

            $this.hasClass('collapsed') ? $collapsibleElement.slideDown():$collapsibleElement.slideUp();
            $this.switchClass('collapsed', 'expanded');

            return evt.preventDefault() && false;
        });

        // invalidate empty link
        jq('a[href=#], a[href=""]').off('click').click(function(evt){
            return evt.preventDefault() && false;
        });

        jq('.a_self_time').click(function(evt){
            var $ct = jq('.self_time'), $box = jq('.self_time_box');
            $ct.hasClass('active') ? $box.slideDown() : $box.slideUp();
            $ct.toggleClass('active');

            return evt.preventDefault() && false;
        });
        jq('.i_close').click(function(evt){
            jq('.self_time').removeClass('active');

            return evt.preventDefault() && false;
        });

        jq('.toggle-fav').click(function(evt){
            var $this = jq(this);
            jq.post('add2fav.jsp', {
                    bk: $this.data('metakey'),
                    id: $this.data('billid'),
                    dt: $this.data('appdate'),
                    dir: $this.hasClass('fav-on') ? '0' : '1'
                }, function(ret){
                    true === ret ? $this.addClass('fav-on') : $this.removeClass('fav-on');
                }, 'json');

            return evt.preventDefault() && false;
        });

        jq('.disabled').off('click').click(function(evt){
            return evt.preventDefault() && false;
        });
        // 待办中查看状态
        jq('.wf-state').click(function(){
        	 var $this = jq(this);
        	 var href = $this.data('href');
        	jq.fancybox.open({
                modal: true,
                type: 'ajax',
                href: href
           	 });
           (function(){jq.fancybox.close()}).defer(100);
        });
     
        //业务单据加载中。。。（何时触发此函数？？？Ext.namespace("MAP.ui");此命名空间如何引入？）
        function showMask(_flag, tip){
            /*var maskCount = 0;
            if(_flag){
                maskCount++;
            }
            else{
                maskCount--;
            }
            var bShow = (maskCount>0);
            if(bShow && Ext.get('loading-tip')) {
                tip = tip ? tip : '数据加载中，请稍等...';
                Ext.get('loading-tip').dom.innerHTML = tip;
            }
            showElement('loading-mask2', bShow, 0); // 显示透明遮罩层
            showElement('loading', bShow, 100); // 显示loading图*/
        }
		
        function showElement(eleId, _flag, opacity) {
            /*var mask = Ext.get(eleId);
            if (mask) {
                var isVisible = mask.isVisible();
                if (_flag && !isVisible) {
                    mask.setOpacity(opacity); // IE8 的css不好用?
                    mask.setVisible(true);
                } else if(!_flag && isVisible) {
                    mask.setVisible(false);
                }
            }*/
        }

        jq('[tabindex=0]').focus();
    	
	    // 草稿箱删除
    	jq('#del_my_draft').click(function(){
        	if (window.confirm("提示：您是否确定删除?")) {
	    		var BIDS = [];
	    		jq('input[name=myselect]:checked').each(function(){
	    			BIDS.push(jq(this).val());
	    		});
	    		if (BIDS.length <=0) return;
	    		var BATCHOPTBILL = MAP_C_SERVER_URL + '/rfc.do?__webCall=1&__out=1&__exp=batchDeleteDraft({scm_OADoc},{'+BIDS+'})';
				jq.post(BATCHOPTBILL, function (_resJson) {
	                    if (true === _resJson) {
				            jq('#workspace').load("documents_draft_query_list.jsp?billKey=OADraft");
	                    }
	            }, 'json');
        	}
		});
		
		// 草稿箱全选
    	jq('#sel_all_draft').click(function(){
    		var all_checked = jq(this)[0].checked;
    		jq('input[name=myselect]').each(function(){
    			jq(this).attr('checked', all_checked);
    		});
	    });
		
		// 新建电子审批
		jq('#createEle').click(function(){
			jq.fancybox.open({
				modal: true,
				type: 'ajax',
				href: 'workflow_add2.jsp'
			});
		});
		
		// 新建电子审批得到的选项
		jq('.lib-tab .tab-head li').click(function(){
			// 设置当前的样式hover,将其它选项去除hover样式（流程类型）
			jq(this).addClass('hover').siblings().removeClass("hover");
			// 去除所有的hover样式（表单）
			jq('.lib-tab .tab-content a').siblings().removeClass("hover");
			// 流程类型的ID
			var flowtypeID = jq(this).children()[0].id;
			jq('.lib-tab .tab-content').load('workflow_add_bill.jsp?ID='+flowtypeID);
		});
		
		// 电子审批右侧表单
		jq('.lib-tab .tab-content a').click(function(){
			jq(this).addClass('hover').siblings().removeClass("hover");
		});
		
		// 新建确定按钮
		jq('#create-ok').click(function(){
			if (jq('.lib-tab .tab-content a').hasClass('hover')){
				jq('.lib-tab .tab-content a').each(function(){
					if (jq(this).hasClass('hover')) {
						var metaKey = jq(this).attr('name');
						var scommand = metaKey;
						//Ext.destroyLegacyComponents();
						jq.fancybox.close(true);
						var width = $workspace.innerWidth()-6;
						var heigth = $workspace.innerHeight() - 6;
						$workspace.load('workflow_add.jsp?type='+scommand+'&w='+width+'&h='+heigth);
						jq(this).activeMenuItem();
					};
				});
			} else {
				alert('提示：请您选择需要创建的流程名称！');
			}
		});
		
		// 新建取消按钮
		jq('#create-cancel').click(function(){
			jq.fancybox && jq.fancybox.close(true);
			//点击取消返回首页
			if(location.href.indexOf('create')>0){
				history.go(-1);
			}
		});
		
		// 首页创建流程跳转
		var create_default = jq.getUrlParam('_create');
		if (create_default && create_default.indexOf(1) != -1) {
			jq.fancybox.open({
				modal: true,
				type: 'ajax',
				href: 'workflow_add2.jsp'
			});
		}
		
        //电子审批 右下角 添加 “回到顶部”  按钮
        var PrtScreenWidth = jq(window).width();
        (new GoTop()).init({
            pageWidth		:PrtScreenWidth,
            nodeId			:'go-top',
            nodeWidth		:36,
            distanceToBottom	:100,
            hideRegionHeight	:0,
            distanceToPage 		:0,
            path			: appCtx + '/_$/resources/@buildin/images/TOP.gif'

        });

       

		
	});
}(window.jQuery);

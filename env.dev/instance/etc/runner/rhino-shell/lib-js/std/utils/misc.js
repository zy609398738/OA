define(function () {
	var log = getLogger("misc.js");
	
    var StringEscapeUtils = Packages.org.apache.commons.lang3.StringEscapeUtils;

    /** Replace ${XXX} in a string */
    var replacePlaceHolder = function(string, dataOrProvider, thisObj){
        if (!string || !dataOrProvider){
            return string;
        };
        if (! thisObj){
            thisObj = this;
        }
        string = string + "";   //Force to javascript string
        var result = string.replace(
            /\$\{(.*?)\}/g,
            function(s0){
                s0 = s0.substr(2,s0.length-3);
                var result = null;
                if (typeof dataOrProvider == "function"){
                    //If argument 2 is a provider
                    result = dataOrProvider.call(thisObj, s0);
                }else{
                    //Just the data
                    result = dataOrProvider[s0];
                }
                if (null==result){
                    result = "${" + s0 + "}";
                }
                return result;
            }
        );
        return result;
    };
    
    /** Trim string or string array */
    var trim = function(str){
        if (! str){
            return str;
        }
        if (str.join){
            //If argument is an array, trim every element
            for(var i=0; i<str.length; i++){
                str[i] = trim(str[i]);
            }
            return str;
        }else{
            var jstr = new java.lang.String(str);
            jstr = jstr.trim();
            return jstr + "";
        }
    };
    
    /** startsWith */
    var startsWith = function(str, found) {
        if (null==str){
            return false;
        }
        if (null==found){
            return true;
        }
        var test = str.substr(0, found.length);
        return (test==found);
        /* TESTCASE
         //
         startsWith(null, null)          //false
         startsWith(null, "123")         //false
         startsWith("123*.jar", null)    //true
         startsWith("123*.jar", "123")   //true
         startsWith("123*.jar", "1234")  //false
         startsWith("123", "123")        //true
         startsWith("123", "1234")       //false
         */
    }
    
    /** endsWith */
    var endsWith = function(str, found) {
        if (null==str){
            return false;
        }
        if (null==found){
            return true;
        }
        var test = str.substr(str.length - found.length);
        return (test==found);
        /* TESTCASE
        //
        endsWith(null, null)           //false
        endsWith(null, "123")          //false
        endsWith("123*.jar", null)     //true
        endsWith("123*.jar", "*.jar")  //true
        endsWith("123*.jar", "*_jar")  //false
        endsWith("123", "123")         //true
        endsWith("123", "1234")        //false
        */
    };
    
    /** Get every element of an array and process */
    var arrayForEach = function(array, fn, thisObj){
        if (!array || !array.join || !fn){
            return;
        }
        if (! thisObj){
            thisObj = this;
        }
        for(var i=0; i<array.length; i++){
            fn.call(thisObj, array[i], i);
        }
    }
    
    /** Escape and native2ascii for properties file key or value */
    var prepare4Property = function(str){
        if (str){
            var s = new java.lang.String(str+"");
            s = StringEscapeUtils.escapeJava(s);
            return s+"";
        }else{
            return str;
        }
    }
    
    /** Escape and native2ascii for properties file, with all attributes in object
     * obj: object which attribute name and value should be prepared for properties file
     * bothValueAndKey: prepare for both attribute name and value; default is value only
     */
    var prepare4Properties = function(obj, bothValueAndKey){
        var tmp = {};
        for (var key in obj){
            var val = obj[key];
            if (bothValueAndKey){
                tmp[prepare4Property(key)] = prepare4Property(val);
            }else{
                tmp[key] = prepare4Property(val);
            }
        }
        return tmp;
    }
    
    /** Join several parts to a path string */
    var joinPath = function(path){
        if (path.join && !path.toCharArray){	//Be an array and not a java string
            for (var i=0; i<path.length; i++){
                path[i] = path[i]+"";   //Force to javascript string
                if (i>0){   //Remain heading "/" for first path element 
                    path[i] = path[i].replace(/^\//, "");   //The start "/"
                    path[i] = path[i].replace(/^\\/, "");   //The start "\"
                }
                path[i] = path[i].replace(/\/$/, "");   //The end "/"
                path[i] = path[i].replace(/\\$/, "");   //The end "\"
            }
            path = path.join(Packages.java.io.File.separator);
            return path;
        }else{
            return path;
        }
    }
    
    /** Smart detect jdbc driver className from jdbc url string, return null if can't detect */
    var detectJdbcDriver = function(jdbcUrl){
    	if (! jdbcUrl){
    		return null;
    	}
        //jdbc url 的 “jdbc:” 后 3 个字符 与 drvier 的对应关系
        var driverTable = {
            "db2": "com.ibm.db2.jcc.DB2Driver",
            "ora": "oracle.jdbc.driver.OracleDriver",
            "jtd": "net.sourceforge.jtds.jdbc.Driver",
            "sql": "com.microsoft.sqlserver.jdbc.SQLServerDriver",
            "mys": "com.mysql.jdbc.Driver",
        };
        var jdbcUrlKey = jdbcUrl.substr(5,3);
        var jdbcDriver = driverTable[jdbcUrlKey];
        return jdbcDriver;
    }
    
    /** Create the identity string of jdbc url , such as "localhost-3306-testdb" */
    var getJdbcUrlIdentity = function(jdbcUrl){
    	jdbcUrl = jdbcUrl+"";
    	jdbcUrl = trim(jdbcUrl);
    	var id = "";
    	
    	if (startsWith(jdbcUrl, "jdbc:mysql:")){
        	//jdbc:mysql://<host>:<port>/<database_name>
    		id = jdbcUrl.substring("jdbc:mysql:".length);
    	}else if (startsWith(jdbcUrl, "jdbc:oracle:thin:@")){
    		//jdbc:oracle:thin:@//<host>:<port>/ServiceName
    		//jdbc:oracle:thin:@<host>:<port>:<SID>
    		id = jdbcUrl.substring("jdbc:oracle:thin:@".length);
    	}else if (startsWith(jdbcUrl, "jdbc:sqlserver:")){
    		//jdbc:sqlserver://<server_name>:<port>
    		id = jdbcUrl.substring("jdbc:sqlserver:".length);
    	}else if (startsWith(jdbcUrl, "jdbc:db2:")){
    		//jdbc:db2://<host>[:<port>]/<database_name>
    		id = jdbcUrl.substring("jdbc:db2:".length);
    	}
    	
    	//去掉 “？”
    	if (id && id.indexOf("?")>=0){
    		id = id.substr(0, id.indexOf("?"));
    	}
    	
    	//处理特殊字符：1)去掉最前面的 “//”, 2)"/" 和 ":" 替换为 "-"
    	if (startsWith(id, "//")){
    		id = id.substring("//".length);
    	}
    	id = id.replace("/", "-");
    	id = id.replace(":", "-");
    	
    	if (! id){
    		throw "Unsupported jdbc URL: " + jdbcUrl;
    	}
    	return id;
    }
	
	/**
	 * Check Database ready or not;
	 * NOTE:
	 *   - If "checkSql" is null(or empty string), Check database connection only;
	 *   - The result of "checkSql" MUST contain 1 line and 1 column at least, and it's value(1st column of 1st line) MUST
	 *     be an integer, which value > 0 means database is ready.
	 */
	var checkForDBReady = function(jdbcUrl, dbUser, password, checkSql){
		log.info ("Begin to check database connection: "+dbUser+"@"+jdbcUrl+", SQL='"+checkSql+"' ...");
		var checkResult = false;
		checkResult = _doCheckForDBReady(jdbcUrl, dbUser, password, checkSql);
		while(!checkResult){
			java.lang.Thread.sleep(6000);
			checkResult = _doCheckForDBReady(jdbcUrl, dbUser, password, checkSql);
		}
	}
	var _doCheckForDBReady = function(jdbcUrl,dbUser,password,checkSql){
		var ResultSet = java.sql.ResultSet;
		var jdbcDriver = detectJdbcDriver(jdbcUrl);
		var dbClass = java.lang.Class.forName(jdbcDriver);

		var conn = null;
		try{
			conn = java.sql.DriverManager.getConnection(jdbcUrl, dbUser, password);
			if(null!=checkSql && checkSql.trim().length>0){
				var ps = conn.prepareStatement(checkSql,ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
				var rs = ps.executeQuery();
				var ready = false;
				if(rs.first()){
					var targetResult = rs.getInt(1);
					if(targetResult > 0){
						log.info("[Database READY] "+dbUser+"@"+jdbcUrl+", SQL='"+checkSql+"'");
						ready = true;
					}else{
						log.info("[Database NOT READY - target result="+targetResult+"] "+dbUser+"@"+jdbcUrl+", SQL='"+checkSql+"'");
					}
				}else{
					log.info("[Database NOT READY - no result] "+dbUser+"@"+jdbcUrl+", SQL='"+checkSql+"'");
				}
				rs.close(); ps.close();
				return ready;
			}else{
				log.info("[Database READY - connect only] "+dbUser+"@"+jdbcUrl);
				return true;
			}
		}catch(err){
			log.warn("[Database check FAIL] "+dbUser+"@"+jdbcUrl+": "+err);
			return false;
		}finally{
			if(null != conn){ conn.close(); }
		}
	}
    
    return {
        replacePlaceHolder: replacePlaceHolder,
        trim: trim,
        startsWith: startsWith,
        endsWith: endsWith,
        arrayForEach: arrayForEach,
        prepare4Property: prepare4Property,
        prepare4Properties: prepare4Properties,
        joinPath: joinPath,
        detectJdbcDriver: detectJdbcDriver,
        getJdbcUrlIdentity: getJdbcUrlIdentity,
		checkForDBReady: checkForDBReady
    }
});
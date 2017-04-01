# YRT01 - Yigo-redist Official Toolkit, 第一部分

## 使用方法
通过插件使用，参考 https://dev.bokesoft.com:9443/trac/support/browser/Yigo-redist/trunk/Projects/01.1-general-demo/profiles/demo-yrt01/profile.js?rev=5787#L28 (第28行).

## 支持参数化的 SQL 操作
在很多场景下 Yigo 提供的 `DBQuery`/`DBSql` 只能简单的使用 SQL 字符串，在实际使用中往往导致大量的SQL 语句字符串拼接，增加复杂度的同时很容易带入 `SQL 注入` 风险。

参数化 SQL 通过在 SQL 语句中使用 `${参数名}` 来避免繁杂的 SQL 字符串拼接，并且通过将 SQL 语句转换为带 `?` 的 `JDBC prepareStatement` 避免 `SQL 注入` 风险，简化日期等特殊类型数值的设置。

对于具体参数的值，在执行 SQL 中系统将通过中间层上下文从 `ExtraValue` 和 当前 document 的数据中获取, 比如 `{$Checker}` 就代表当前单据中 `审批人` 的 ID。

包括如下公式:
 - yigo.rt01.DB.Query(`sql 语句`, `字段名`)
 - yigo.rt01.DB.Query(`sql 语句`, `字段名`, `分隔符`)
 - yigo.rt01.DB.Update(`sql 语句`)

上述公式的定义详见: https://dev.bokesoft.com:9443/trac/support/browser/Yigo-redist/trunk/Yigo-redist/products/yigo-redist-toolkit/yrt01/project/src/yigo/rt01/DB.java?rev=5787

## 通过 SQL 语句执行 Yigo 单据 的变换
通过一张单据触发产生/更新另外一张单据的功能，主要针对“接口单据保存时产生相应业务单据”这类场景。

主要公式:
 - yigo.rt01.SqlMph.Transfer(`定义文件`)
  * `Transfer` 是执行变换的主要公式, 通过参数(`定义文件`)指定的文件中对数据变换的定义，基于当前单据的数据产生新的单据。
  * `定义文件` 使用 [`YAML`](http://www.yaml.org/) 格式, **必须使用 UTF-8 编码**, 其中包含的字段参见: https://dev.bokesoft.com:9443/trac/support/browser/Yigo-redist/trunk/Yigo-redist/products/yigo-redist-toolkit/yrt01/project/src/com/bokesoft/yigo/rt01/sqlmorphing/MorphingConfigVO.java?rev=5787

辅助公式
 - yigo.rt01.SqlMph.DtlDBValue(`数据列名`)
  * 在数据转换过程中, 常常需要在公式中获取“当前正在处理的明细行的某列的值”，这个公式实现了该功能。

上述公式的定义详见: https://dev.bokesoft.com:9443/trac/support/browser/Yigo-redist/trunk/Yigo-redist/products/yigo-redist-toolkit/yrt01/project/src/yigo/rt01/SqlMph.java?rev=5787

作为具体的使用示例，请参考:
 - `SaveObject` 子操作的 pre trigger 定义 `_Mid_PostTrigger_SaveObject`: https://dev.bokesoft.com:9443/trac/support/browser/Yigo-redist/trunk/Projects/01.1-general-demo/modules/config/Module/SCM/Bill/Bill_SqlMorphing_TEST01.xml?rev=5787#L354
 - 定义文件示例: https://dev.bokesoft.com:9443/trac/support/browser/Yigo-redist/trunk/Projects/01.1-general-demo/modules/config/Module/SCM/SqlMorphing/test?rev=5787
 - 参考 `YAML` 文件格式说明: http://www.yaml.org/spec/1.2/spec.html

## 杂项功能

包括如下公式:
 - yigo.rt01.Misc.SaveObject(): 替代 Yigo 默认提供的 SaveObject() 公式

上述公式的定义详见: https://dev.bokesoft.com:9443/trac/support/browser/Yigo-redist/trunk/Yigo-redist/products/yigo-redist-toolkit/yrt01/project/src/yigo/rt01/Misc.java?rev=5787

##END

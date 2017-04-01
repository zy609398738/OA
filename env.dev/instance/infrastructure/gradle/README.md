# 基于 Gradle 的后端 Java 代码模块化

## 主要解决的问题
 1. Java 模块的构建和依赖管理；
 2. 与 [Yigo-redist](https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/README.md?rev=5837) 集成的`开发-部署` 过程管理；

## 关于 Gradle
 - http://gradle.org/
 - [Gradle Build Language Reference](https://docs.gradle.org/current/dsl/index.html)

## 关于本方案
本文所述的方案是在 Gradle 的基础上, 针对需要解决的问题定制实现的，核心实现见 [instance/infrastructure/gradle/boke-devops/boke-devops.gradle](https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/infrastructure/gradle/boke-devops/boke-devops.gradle?rev=5837) 。
 * 定义了标准的 `repositories`：`mavenLocal()`、`mavenCentral()` 等；
 * 定义了几个常用任务: `devOpsClean`、`devOpsDist`；
 * 每个模块使用 依赖定义文件(`.gradle` 文件, 通常命名为 `deps.gradle`) 定义其依赖关系，依赖可以来自 maven 中心库，也可以直接依赖本地目录中的 jar 文件；
 * 依赖可以在模块间传递，可以通过引用(`apply from:`)某个模块的依赖定义文件获得该模块的全部依赖；
 * 为了实现多个模块之间依赖关系的继承，定义了两个扩展方法 `devOpsApply` 和 `devOpsFileTree`，用于代替系统中的 `apply` 和 `fileTree`，解决引用依赖定义文件和定义本地依赖 jar 包时对相对路径的处理问题；
 * 定制 `eclipse.classpath.file`，解决 eclipse 插件在创建 eclipse 工程时本地依赖 jar 包的源代码路径定义问题；

以下为使用本方案的工程样例：
 - `cms2-site`：
  * https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/plugins/bokesoft.com/cms2-site?rev=5837
  * 依赖关系：[`cms2-site/build.gradle`](https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/plugins/bokesoft.com/cms2-site/build.gradle?rev=5837) ==> [`cms2-site/deps.gradle`](https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/plugins/bokesoft.com/cms2-site/deps.gradle?rev=5837) ==> [`cms2/cms2.gradle`](https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/plugins/bokesoft.com/cms2/cms2.gradle?rev=5837)
 - `cms2-yigo1.6-adapter`：
  * https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/plugins/bokesoft.com/cms2-yigo1.6-adapter?rev=5837
  * 依赖关系：[`cms2-yigo1.6-adapter/build.gradle`](https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/plugins/bokesoft.com/cms2-yigo1.6-adapter/build.gradle?rev=5837) ==> [`cms2-yigo1.6-adapter/deps.gradle`](https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/plugins/bokesoft.com/cms2-yigo1.6-adapter/deps.gradle?rev=5837) ==> [`cms2/cms2.gradle`](https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/plugins/bokesoft.com/cms2/cms2.gradle?rev=5837) + [`yigo1.6/yigo1.6.gradle`](https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/plugins/bokesoft.com/yigo1.6/yigo1.6.gradle?rev=5837)

## 典型的 Java 工程组成
 - `src/`：源代码目录；
  * 遵循 maven 惯例，分为 `main/java`、`main/resources`、`test/java`、`test/resources` 4 个子目录；
 - `gradle/`：gradle 启动程序(`gradle-wrapper`)；
  * 文件 `wrapper/gradle-wrapper.properties` 通过属性 `distributionUrl` 定义了第一次运行时自动下载安装的 gradle 压缩包的路径，目前指向 https://dev.bokesoft.com/public/ecomm/downloads/gradle-2.11-all.zip ；
 - `dist/`：编译打包后用于发布的 jar 和 source-jar；
  * `/jars/`: 存放运行时需要的二进制 jar 包；
  * `/srcs/`: 存放源代码 jar 包；
  * `/libs/`: 运行时需要引用的依赖 jar 包; 一般情况下，只需要存放当前模块“额外”需要的 jar 包而不需要包含所依赖模块的依赖 jar 包。
 - `gradlew.bat`：在 Windows 下执行 gradle 的批处理命令；
 - `gradlew`：在 Linux/Unix 下执行 gradle 的脚本；
 - `build.gradle`：默认的 gradle 构建脚本；
 - `deps.gradle`：定义当前工程的依赖关系, 除了供当前工程编译需要外，还可以用于传递依赖关系到使用当前工程的工程。

## "SDK" 工程
与普通的 Java 工程不同，所谓 “SDK” 通常指不是通过 gradle 创建和发布的模块，通常是通过外部的发布版本移植过来的，典型的，对 Yigo、CMS 等外部功能模块就是采用 SDK 的方式供其他模块开发使用的。

参考：
 - Yigo 1.6 的 依赖定义 [instance/plugins/bokesoft.com/yigo1.6/yigo1.6.gradle](https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/plugins/bokesoft.com/yigo1.6/yigo1.6.gradle?rev=5827)
 - CMS2 的 依赖定义 [instance/plugins/bokesoft.com/cms2/cms2.gradle](https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/plugins/bokesoft.com/cms2/cms2.gradle?rev=5827)

## 如何开始一个 Java 工程
### 1. 通过复制模板目录产生新工程
 - 如果新的工程是一个简单的 java jar 包，建议复制来源：`Yigo2-redist/instance/infrastructure/gradle/templates/java-jar`
 - 建议使用 SVN 的 “分支/标记” 功能，在 SVN Repo 中以分支的形式复制模板目录到需要的位置；
  * *通过 SVN 分支可以比较好的保留必要的 `svn:ignore` 等属性，同时也方便分支间在必要情况下的合并功能*。

### 2. 设置项目的属性 - `build.gradle`
```sh
# 工程的描述等基本信息
description '简单 jar 包项目模板'
group 'com.bokesoft.projects.XXX'
version '1.0'
# 指定 `devOpsDist`(执行 clean、complie 直到 dist 的全部动作) 为默认的 task
defaultTasks 'devOpsDist'
# 指定 Java 编译基本参数
apply plugin: 'java'
sourceCompatibility = 1.7
compileJava.options.encoding = 'UTF-8'
# 指定打包发布的目录(包含子目录 `jars`、`srcs` 和 `libs`)
distsDirName = "${projectDir}/dist"
# 从 `boke-devops.gradle` 引用自定义的方法和任务
apply from: "../../../infrastructure/gradle/boke-devops/boke-devops.gradle"
# 引用当前模块的依赖定义, 建议当前模块依赖定义文件总是命名为 "deps.gradle"
devOpsApply from: "deps.gradle"
# 可选: 定义需要复制到 ``${distsDirName}/libs` 目录下的依赖 jar 包(用于 plugin 运行时使用)
devOpsDefineExports (
	include: ["a*.jar", "c*.jar"],
	exclude: ["cms*.jar"]
)
```

总结：
 - 通过 `devOpsApply` 代替 `apply` 引入依赖的 gradle 定义文件，支持基于当前 gradle 文件位置相关的 相对路径。

参考：
 - https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/infrastructure/gradle/templates/java-jar/build.gradle?rev=5837

### 3. 定义依赖 - `deps.gradle`
```sh
dependencies {
  # 此处可以直接定义 maven2 格式的依赖(compile 'org.apache.velocity:velocity-tools:2.0')，也可以在本地目录下寻找
  compile devOpsFileTree(dir: "dist/jars", include: ['*.jar'])
}
# 引用其他模块的 gradle 依赖定义，支持多级依赖定义
devOpsApply from: "../cms2/cms2.gradle"
```

总结：
 - 通过 `devOpsApply` 代替 `apply` 引入依赖的 gradle 定义文件，支持基于当前 gradle 文件位置相关的 相对路径；
 - 通过 `devOpsFileTree` 代替 `fileTree` 引入依赖的本地 jar 包，支持基于当前 gradle 文件位置相关的 相对路径；

参考：
 - https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/infrastructure/gradle/templates/java-jar/deps.gradle?rev=5837
 - https://dev.bokesoft.com:9443/trac/ecomm/browser/Yigo-redist/trunk/Yigo2-redist/instance/plugins/bokesoft.com/cms2/cms2.gradle?rev=5837

### 4. 构建任务
#### 概述
 - 通过工程目录下的 `gradlew` 命令执行构建任务，执行时需要指定环境变量 `JAVA_HOME`；
 - 不带参数运行 `gradlew` 即可执行默认构建任务；
 - 可以在命令中指定具体的任务名称，如：
  * `gradlew devOpsClean`
 - 可以通过参数指定日志输出信息的级别 - `-i`：INFO，`-d`：DEBUG，如
  * `gradlew -i`
  * `gradlew eclipse -d`

#### 常用的构建任务
 - `devOpsDist`: 执行 `清理-编译-分发` 的完整过程；
  * 默认情况下，此任务最终会在当前工程的`dist`目录下产生编译后的 jar 包和源代码 source-jar 包；
  * 建议在 `build.gradle` 中指定这个任务为 `defaultTasks`；
 - `devOpsClean`: 执行 清理 过程；
  * 默认情况下，将清除当前工程的 `build/` 和 `dist/` 目录；
 - `eclipse`: 通过 eclipse 插件将当前工程转化为一个 eclipse 项目；
  * 会自动产生 `.project`、`.classpath`、`.settings/` 等文件和目录，建议这些文件设置为 `svn:ignore`；
 - `idea`: 通过 idea 插件将当前工程转化为一个 IDEA 项目；
  * **未经测试！**

*备注：在自己扩展定义 gradle 任务时，需要尽量避免使用 `devOpsDist`、`devOpsClean` 这些在 `boke-devops.gradle` 中已经定义的任务名，对于任务名称的冲突，不确定在 gradle 体系下是否有更合理的解决方案，此问题待后续优化。*

## 其他补充
### 关于调试
可以在设置如下 `GRADLE_OPTS` 之后再运行 `gradlew` 命令行即可
```
export GRADLE_OPTS="-Xdebug -Xrunjdwp:transport=dt_socket,address=9999,server=y,suspend=y"
```

## END

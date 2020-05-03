# OpenDESK

OpenDESK is a collaboration web app that grant users easy access to an Alfresco repository and a range of 
other services combined with chat and simple workflow tools.

## Installation

#### NOTE: project 'backend' is deprecated in favor of maven project 'opendesk-repo'
#### NOTE: project 'frontend' is deprecated in favor of maven project 'opendesk-angular'

in these new project you can now created 'amp', 'jar' and 'installable jar' (new module alfresco from SDK 3 and after) with the simple command:

```

mvn clean install

```

NOTE: The 'amp' is tested the 'installable jar' need some tune up so avoid to use for now.

NOTE: The client angular project has a pom.xml for build the angular application in a war webapp for tomcat if you want.


In alfresco-global.properties you must set the following parameters:

```

openDesk.host = localhost:8080
openDesk.protocol = http
openDesk.notifications.truncation.limit = 15

```

## with version of Alfresco Community is enable for this ?

Is tested with 5.1.X and 5.2X community edition, but on the backend project (repository alfresco) we manage the dependencies by using the project [Acosix Alfresco maven](https://github.com/Acosix/alfresco-maven) this project is on the maven cetral and will take care of almost everything, from alfresco 4.2.0 to 6.2.0

For use your specific version of Alfresco Community you must replace the version on the <parent> tag and on <dependencyManagement> with your version, here a example for the '5.2.g' Alfresco community version

```

	<parent>
		<groupId>de.acosix.alfresco.maven</groupId>
		<artifactId>de.acosix.alfresco.maven.project.parent-5.2.g</artifactId>
		<version>1.2.1</version>
	</parent>
	
	....
	
	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>de.acosix.alfresco.maven</groupId>
				<artifactId>de.acosix.alfresco.maven.project.parent-5.2.g</artifactId>
				<version>1.2.1</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>	
	</dependencyManagement>

```

## Docker Build

TODO 

## TODO make other documentation.....

## Development (TODO to finish)

Do the following to run the (backend) test suite:

```
$ cd /path/to/OpenDESK/backend
$ rm -rf alf_data_dev
$ mvn clean test
```

## License
Please see the license for this project in the `LICENSE` file found in the root of the project.

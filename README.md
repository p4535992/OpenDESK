# OpenDESK

OpenDESK is a collaboration web app that grant users easy access to an Alfresco repository and a range of 
other services combined with chat and simple workflow tools.

## Installation

mvn clean install for generate amp and jar for SDK Alfresco

#### NOTE: project backend is deprated in favor of opendesk-repo
#### NOTE: project frontend is deprecated in favor of opendesk-angular

In alfresco-global.properties you must set the following parameters:

openDesk.host = localhost:8080
openDesk.protocol = http
openDesk.notifications.truncation.limit = 15

## Development

Do the following to run the (backend) test suite:

```
$ cd /path/to/OpenDESK/backend
$ rm -rf alf_data_dev
$ mvn clean test
```

## License
Please see the license for this project in the `LICENSE` file found in the root of the project.

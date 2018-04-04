export const Spec = {
    "swagger": "2.0",
    "info": {
        "version": "0.3.0",
        "title": "Task API",
        "description": "Foo\n"
    },
    "tags": [
        {
            "name": "Tasks",
            "description": "Describe the Task API in detail here."
        }
    ],
    "schemes": [
        "http",
        "https"
    ],
    "consumes": [
        "application/json"
    ],
    "produces": [
        "application/json"
    ],
    "basePath": "/v0",
    "paths": {
        "/tasks": {
            "post": {
                "summary": "Create a task",
                "description": "Create a task.",
                "tags": [
                    "Tasks"
                ],
                "operationId": "CreateTask",
                "parameters": [
                    {
                        "in": "body",
                        "name": "task",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "name": {
                                    "description": "Short, human-readable name.",
                                    "type": "string"
                                },
                                "description": {
                                    "description": "Longer, human-readable description.",
                                    "type": "string"
                                },
                                "inputs": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/Input"
                                    },
                                    "description": "Input files to be downloaded before execution."
                                },
                                "outputs": {
                                    "description": "Output files to be uploaded after execution.",
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/definitions/Output"
                                    }
                                },
                                "resources": {
                                    "description": "Requested resources, e.g. CPU, RAM, etc.",
                                    "$ref": "#/definitions/Resources"
                                },
                                "executors": {
                                    "description": "A list of executors to be run sequentially.\nExecution stops on the first error.\n",
                                    "type": "array",
                                    "required": true,
                                    "items": {
                                        "$ref": "#/definitions/Executor"
                                    }
                                },
                                "volumes": {
                                    "description": "Volumes are directories which may be used to share data between\nExecutors. Volumes are initialized as empty directories by the\nsystem when the task starts and are mounted at the same path\nin each Executor.\n\nFor example, given a volume defined at \"/vol/A\",\nexecutor 1 may write a file to \"/vol/A/exec1.out.txt\", then\nexecutor 2 may read from that file.\n\n(Essentially, this translates to a `docker run -v` flag where\nthe container path is the same for each executor).",
                                    "type": "array",
                                    "items": {
                                        "type": "string"
                                    }
                                },
                                "tags": {
                                    "description": "A key-value map of arbitrary tags.",
                                    "type": "object",
                                    "additionalProperties": {
                                        "type": "string"
                                    }
                                }
                            },
                            "example": {
                                "id": "batvkihkq10g008vc8u0",
                                "name": "Example task",
                                "inputs": [
                                    {
                                        "url": "s3://my-bucket/examples/my-example.txt",
                                        "path": "/inputs/input.txt"
                                    }
                                ],
                                "outputs": [
                                    {
                                        "url": "s3://my-bucket/examples/output/stdout.txt",
                                        "path": "/outputs/stdout.txt"
                                    },
                                    {
                                        "url": "s3://my-bucket/examples/output/stderr.txt",
                                        "path": "/outputs/stderr.txt"
                                    }
                                ],
                                "volumes": [
                                    "/tmp"
                                ]
                            }
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "title": "CreateTaskResponse",
                            "type": "object",
                            "properties": {
                                "id": {
                                    "type": "string",
                                    "description": "ID of the created task.",
                                    "example": "bb009f1kq10g008vc910"
                                }
                            }
                        }
                    }
                }
            },
            "get": {
                "summary": "List tasks",
                "description": "Returns a list of tasks, sorted by creation date/time, with the most recent\ntasks appearing first.",
                "operationId": "ListTasks",
                "tags": [
                    "Tasks"
                ],
                "parameters": [
                    {
                        "in": "query",
                        "name": "pageSize",
                        "description": "The number of Tasks to return in one page.",
                        "type": "integer",
                        "format": "int64",
                        "default": 256,
                        "minimum": 1,
                        "maximum": 2048
                    },
                    {
                        "in": "query",
                        "name": "pageToken",
                        "description": "Opaque page token defining the beginning of the Task list page.",
                        "type": "string"
                    },
                    {
                        "in": "query",
                        "name": "view",
                        "description": "Affects the fields included in the returned Tasks.\n- MINIMAL: only id and state. \n- BASIC: all fields except stdout, stderr, and input content.\n- FULL: all fields\n",
                        "type": "string",
                        "default": "MINIMAL",
                        "enum": [
                            "MINIMAL",
                            "BASIC",
                            "FULL"
                        ]
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "type": "object",
                            "title": "ListTasksResponse",
                            "properties": {
                                "tasks": {
                                    "type": "array",
                                    "description": "List of tasks.",
                                    "items": {
                                        "$ref": "#/definitions/Task"
                                    }
                                },
                                "nextPageToken": {
                                    "type": "string",
                                    "description": "Token used to request the next page of results."
                                }
                            }
                        }
                    }
                }
            }
        },
        "/tasks/{id}": {
            "get": {
                "summary": "Get a task",
                "description": "Get a task by ID.",
                "operationId": "GetTask",
                "tags": [
                    "Tasks"
                ],
                "parameters": [
                    {
                        "name": "id",
                        "in": "path",
                        "required": true,
                        "description": "ID of the task to get.",
                        "type": "string"
                    },
                    {
                        "name": "view",
                        "description": "Affects the fields included in the returned Task messages.\n\n - MINIMAL only includes:\n    - Task.id\n    - Task.state\n - BASIC includes all fields except:\n    - Task.ExecutorLog.stdout\n    - Task.ExecutorLog.stderr\n    - Input.content\n    - TaskLog.systemLogs\n - FULL includes all fields",
                        "in": "query",
                        "type": "string",
                        "enum": [
                            "MINIMAL",
                            "BASIC",
                            "FULL"
                        ],
                        "default": "MINIMAL"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Created.",
                        "schema": {
                            "$ref": "#/definitions/Task"
                        }
                    }
                }
            }
        },
        "/tasks/{id}:cancel": {
            "post": {
                "summary": "Cancel a task",
                "description": "Cancel a task.",
                "operationId": "CancelTask",
                "tags": [
                    "Tasks"
                ],
                "parameters": [
                    {
                        "name": "id",
                        "description": "ID of the task to cancel.",
                        "in": "path",
                        "required": true,
                        "type": "string"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK"
                    },
                    "404": {
                        "description": "Task not found."
                    }
                }
            }
        },
        "/tasks/service-info": {
            "get": {
                "summary": "Get service info",
                "description": "Get metadata information about the service, such as storage details,\nresource availability, and other documentation.",
                "operationId": "GetServiceInfo",
                "tags": [
                    "Tasks"
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/ServiceInfo"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "Executor": {
            "title": "Executor",
            "description": "Executor describes a command to be executed, and its environment.",
            "type": "object",
            "example": {
                "image": "ubuntu",
                "command": [
                    "md5sum",
                    "input.txt"
                ],
                "workdir": "/inputs",
                "stdout": "/outputs/stdout.txt",
                "stderr": "/outputs/stderr.txt",
                "env": {
                    "FOO": "bar"
                }
            },
            "properties": {
                "image": {
                    "type": "string",
                    "required": true,
                    "description": "Name of the container image."
                },
                "command": {
                    "type": "array",
                    "required": true,
                    "items": {
                        "type": "string"
                    },
                    "description": "A sequence of program arguments to execute,\nwhere the first argument is the program to execute\n(i.e. argv)."
                },
                "workdir": {
                    "type": "string",
                    "description": "The working directory that the command will be executed in.\nDefaults to the directory set by the container image."
                },
                "stdin": {
                    "type": "string",
                    "description": "Path inside the container to a file which will be piped\nto the executor's stdin. Must be an absolute path."
                },
                "stdout": {
                    "type": "string",
                    "description": "Path inside the container to a file where the executor's\nstdout will be written to. Must be an absolute path."
                },
                "stderr": {
                    "type": "string",
                    "description": "Path inside the container to a file where the executor's\nstderr will be written to. Must be an absolute path."
                },
                "env": {
                    "description": "Enviromental variables to set within the container.",
                    "type": "object",
                    "additionalProperties": {
                        "type": "string"
                    }
                }
            }
        },
        "ExecutorLog": {
            "title": "ExecutorLog",
            "description": "ExecutorLog describes logging information related to an Executor.",
            "type": "object",
            "properties": {
                "startTime": {
                    "type": "dateTime",
                    "description": "Time the executor started."
                },
                "endTime": {
                    "type": "dateTime",
                    "description": "Time the executor ended."
                },
                "stdout": {
                    "type": "string",
                    "description": "Stdout content.\n\nThis is meant for convenience. No guarantees are made about the content.\nImplementations may chose different approaches: only the head, only the tail,\na URL reference only, etc.\n\nIn order to capture the full stdout users should set Executor.stdout\nto a container file path, and use Task.outputs to upload that file\nto permanent storage."
                },
                "stderr": {
                    "type": "string",
                    "description": "Stderr content.\n\nThis is meant for convenience. No guarantees are made about the content.\nImplementations may chose different approaches: only the head, only the tail,\na URL reference only, etc.\n\nIn order to capture the full stderr users should set Executor.stderr\nto a container file path, and use Task.outputs to upload that file\nto permanent storage."
                },
                "exitCode": {
                    "description": "Exit code.",
                    "type": "integer",
                    "format": "int32"
                }
            }
        },
        "FileType": {
            "title": "FileType",
            "type": "string",
            "enum": [
                "FILE",
                "DIRECTORY"
            ],
            "default": "FILE"
        },
        "Input": {
            "title": "Input",
            "description": "Task input file.",
            "type": "object",
            "example": {
                "url": "s3://my-bucket/examples/input-file.txt",
                "path": "/inputs/example.txt"
            },
            "properties": {
                "name": {
                    "description": "Short, human-readable name.",
                    "type": "string"
                },
                "description": {
                    "description": "Longer, human-readable description.",
                    "type": "string"
                },
                "url": {
                    "description": "URL to input file. Required, unless \"content\" is set.\n",
                    "type": "string"
                },
                "path": {
                    "description": "Path of the file inside the container.\nMust be an absolute path.",
                    "type": "string",
                    "required": true
                },
                "type": {
                    "$ref": "#/definitions/FileType",
                    "description": "Type of the file, FILE or DIRECTORY"
                },
                "content": {
                    "description": "File content literal.\n\nImplementations should support a minimum size of 128 KiB\nin this field and may define their own maximum.\nUTF-8 encoded.\n\nIf content is not empty, \"url\" must be ignored.\n",
                    "type": "string"
                }
            }
        },
        "Output": {
            "title": "Output",
            "description": "Task output file.",
            "type": "object",
            "properties": {
                "name": {
                    "description": "Short, human-readable name.",
                    "type": "string"
                },
                "description": {
                    "description": "Longer, human-readable description.",
                    "type": "string"
                },
                "url": {
                    "description": "URL in long term storage, for example:\ns3://my-object-store/file1\ngs://my-bucket/file2\nfile:///path/to/my/file\n/path/to/my/file\netc...",
                    "type": "string"
                },
                "path": {
                    "description": "Path of the file inside the container.\nMust be an absolute path.",
                    "type": "string",
                    "required": true
                },
                "type": {
                    "description": "Type of the file, FILE or DIRECTORY",
                    "$ref": "#/definitions/FileType"
                }
            }
        },
        "OutputFileLog": {
            "title": "OutputFileLog",
            "description": "OutputFileLog describes a single output file. This describes\nfile details after the task has completed successfully,\nfor logging purposes.",
            "type": "object",
            "properties": {
                "url": {
                    "description": "URL of the file in storage, e.g. s3://bucket/file.txt",
                    "type": "string"
                },
                "path": {
                    "description": "Path of the file inside the container.\nMust be an absolute path.",
                    "type": "string"
                },
                "sizeBytes": {
                    "description": "Size of the file in bytes.",
                    "type": "string",
                    "format": "int64"
                }
            }
        },
        "Resources": {
            "title": "Resources",
            "description": "Resources describes the resources requested by a task.",
            "type": "object",
            "properties": {
                "cpuCores": {
                    "description": "Requested number of CPUs.",
                    "type": "integer",
                    "format": "int64",
                    "example": 1
                },
                "preemptible": {
                    "description": "Is the task allowed to run on preemptible compute instances?",
                    "type": "boolean",
                    "format": "boolean",
                    "default": false
                },
                "ramGB": {
                    "description": "Requested RAM required in gigabytes (GB)",
                    "type": "number",
                    "format": "double",
                    "example": 4
                },
                "diskGB": {
                    "description": "Requested disk size in gigabytes (GB)",
                    "type": "number",
                    "format": "double",
                    "example": 40
                },
                "zones": {
                    "description": "Request that the task be run in these compute zones.",
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "example": [
                        "us-west1-a",
                        "us-east1-a"
                    ]
                }
            }
        },
        "ServiceInfo": {
            "title": "ServiceInfo",
            "description": "ServiceInfo describes information about the service,\nsuch as storage details, resource availability,\nand other documentation.",
            "type": "object",
            "properties": {
                "name": {
                    "description": "Returns the name of the service.",
                    "type": "string",
                    "example": "ga4gh-tes"
                },
                "doc": {
                    "description": "Returns a documentation string.",
                    "type": "string",
                    "example": "Hey, we're the GA4GH!"
                },
                "storage": {
                    "description": "Lists some, but not necessarily all, \nstorage locations supported by the service.",
                    "type": "array",
                    "items": {
                        "type": "string"
                    },
                    "example": [
                        "file:///path/to/local/storage",
                        "s3://ga4gh/storage"
                    ]
                }
            }
        },
        "State": {
            "title": "State",
            "description": "Task states.\n\n - UNKNOWN: The state of the task is unknown.\n - QUEUED: The task is queued.\n - INITIALIZING: The task has been assigned to a worker and is currently preparing to run. The worker may be turning on, downloading input files, etc.\n - RUNNING: The task is running. Input files are downloaded and the first Executor has been started.\n - PAUSED: The task is paused. An implementation may have the ability to pause a task, but this is not required.\n - COMPLETE: The task has completed running. Executors have exited without error and output files have been successfully uploaded.\n - EXECUTOR_ERROR: The task encountered an error in one of the Executor processes. Generally, this means that an Executor exited with a non-zero exit code.\n - SYSTEM_ERROR: The task was stopped due to a system error, but not from an Executor, for example an upload failed due to network issues, the worker's ran out of disk space, etc.\n - CANCELED: The task was canceled by the user.",
            "type": "string",
            "enum": [
                "UNKNOWN",
                "QUEUED",
                "INITIALIZING",
                "RUNNING",
                "PAUSED",
                "COMPLETE",
                "EXECUTOR_ERROR",
                "SYSTEM_ERROR",
                "CANCELED"
            ],
            "default": "UNKNOWN"
        },
        "Task": {
            "title": "Task",
            "description": "A Task is a unit of work, including input files\nto be downloaded, a sequence of containers and commands to run,\nand output files to be uploaded to storage.\n\nTask also includes state (queued, running, complete, etc),\nand logs (stdout, stderr, start/end time, etc).",
            "example": {
                "id": "batvkihkq10g008vc8u0",
                "name": "Example task",
                "state": "QUEUED",
                "inputs": [
                    {
                        "url": "s3://my-bucket/examples/my-example.txt",
                        "path": "/inputs/input.txt"
                    }
                ],
                "outputs": [
                    {
                        "url": "s3://my-bucket/examples/output/stdout.txt",
                        "path": "/outputs/stdout.txt"
                    },
                    {
                        "url": "s3://my-bucket/examples/output/stderr.txt",
                        "path": "/outputs/stderr.txt"
                    }
                ],
                "volumes": [
                    "/tmp"
                ]
            },
            "type": "object",
            "properties": {
                "id": {
                    "description": "Task ID, assigned by the server.",
                    "type": "string"
                },
                "name": {
                    "description": "Short, human-readable name.",
                    "type": "string"
                },
                "description": {
                    "description": "Longer, human-readable description.",
                    "type": "string"
                },
                "state": {
                    "description": "Task state.",
                    "$ref": "#/definitions/State"
                },
                "inputs": {
                    "description": "Input files to be downloaded before execution.",
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Input"
                    }
                },
                "outputs": {
                    "description": "Output files to be uploaded after execution.",
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Output"
                    }
                },
                "resources": {
                    "description": "Request that the task be run with these resources.",
                    "$ref": "#/definitions/Resources"
                },
                "executors": {
                    "description": "A sequence of commands to run and the environment\nto run them in (container image, environment variables, \nstdout, stderr, etc).\n\nExecution stops on the first error.",
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/Executor"
                    }
                },
                "volumes": {
                    "description": "Volumes are directories which may be used to share data between\nExecutors. Volumes are initialized as empty directories by the\nsystem when the task starts and are mounted at the same path\nin each Executor.\n\nFor example, given a volume defined at \"/vol/A\",\nexecutor 1 may write a file to \"/vol/A/exec1.out.txt\", then\nexecutor 2 may read from that file.\n\n(Essentially, this translates to a `docker run -v` flag where\nthe container path is the same for each executor).",
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "tags": {
                    "description": "A key-value map of arbitrary tags.",
                    "type": "object",
                    "additionalProperties": {
                        "type": "string"
                    }
                },
                "logs": {
                    "description": "Task logging information.\nNormally, this will contain only one entry,\nbut in the case where a task fails and is retried,\nan entry will be appended to this list.",
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/TaskLog"
                    }
                },
                "creationTime": {
                    "type": "dateTime",
                    "description": "Date/time the task was created."
                }
            }
        },
        "TaskLog": {
            "title": "TaskLog",
            "description": "Describes logging information related to a Task.",
            "type": "object",
            "properties": {
                "logs": {
                    "description": "Logs for each executor",
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/ExecutorLog"
                    }
                },
                "metadata": {
                    "description": "Arbitrary logging metadata included by the implementation.",
                    "type": "object",
                    "additionalProperties": {
                        "type": "string"
                    }
                },
                "startTime": {
                    "description": "Date + time when the task started.",
                    "type": "dateTime"
                },
                "endTime": {
                    "description": "Date + time when the task ended.",
                    "type": "dateTime"
                },
                "outputs": {
                    "description": "Information about all output files. Directory outputs are\nflattened into separate items.",
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/OutputFileLog"
                    }
                },
                "systemLogs": {
                    "description": "System logs are any logs the system decides are relevant,\nwhich are not tied directly to an Executor process.\nContent is implementation specific: format, size, etc.\n\nSystem logs may be collected here to provide convenient access.\n\nFor example, the system may include the name of the host\nwhere the task is executing, an error message that caused\na SYSTEM_ERROR state (e.g. disk is full), etc.\n\nSystem logs are only included in the FULL task view.",
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        }
    }
}

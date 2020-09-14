export default [{
  "resourceId": "sid-6BD76B47-76C4-444F-A368-C1ADE8B97C14",
  "properties": {
    "overrideid": "",
    "name": "",
    "documentation": "",
    "executionlisteners": "",
    "initiator": "",
    "formkeydefinition": "",
    "formproperties": "",
    "nextResourceId": "sid-3C3F06A1-91BC-47E5-A635-FC34E78074E9"
  },
  "stencil": {
    "id": "StartNoneEvent"
  },
  "childShapes": [],
  "outgoing": [{
    "resourceId": "sid-854AA8DA-F779-49AD-BEB3-EFC9871C9B5F"
  }],
  "bounds": {
    "lowerRight": {
      "x": 60,
      "y": 190
    },
    "upperLeft": {
      "x": 30,
      "y": 160
    }
  },
  "dockers": []
}, 
// {
//   "resourceId": "sid-4F6C23E3-480E-41C2-825E-9AAEC8329321",
//   "properties": {
//     "nextResourceId": ["sid-53F664E4-C8B5-47EC-8077-8078EFA9617D","sid-45DF61EC-6FC2-40AE-9D7C-1AAFABC1C383"],
//     "overrideid": "zzh_node_1",
//     "name": "编制",
//     "documentation": "",
//     "asynchronousdefinition": "false",
//     "exclusivedefinition": "false",
//     "executionlisteners": "",
//     "multiinstance_type": "None",
//     "multiinstance_cardinality": "",
//     "multiinstance_collection": "",
//     "multiinstance_variable": "",
//     "multiinstance_condition": "",
//     "isforcompensation": "false",
//     "usertaskassignment": {
//       "assignment": {
//         "candidateUsers": [{
//           "value": "#{user1}",
//           "$$hashKey": "1E7"
//         }]
//       }
//     },
//     "formkeydefinition": "",
//     "duedatedefinition": "",
//     "prioritydefinition": "",
//     "formproperties": "",
//     "tasklisteners": ""
//   },
//   "stencil": {
//     "id": "UserTask"
//   },
//   "childShapes": [],
//   "outgoing": [{
//     "resourceId": "sid-C6EE182A-C060-4D6F-865A-4F5894BBAB4B"
//   }],
//   "bounds": {
//     "lowerRight": {
//       "x": 201,
//       "y": 215
//     },
//     "upperLeft": {
//       "x": 101,
//       "y": 135
//     }
//   },
//   "dockers": []
// }, 
// {
//   "resourceId": "sid-854AA8DA-F779-49AD-BEB3-EFC9871C9B5F",
//   "properties": {
//     "overrideid": "",
//     "name": "",
//     "documentation": "",
//     "conditionsequenceflow": "",
//     "executionlisteners": "",
//     "defaultflow": "false"
//   },
//   "stencil": {
//     "id": "SequenceFlow"
//   },
//   "childShapes": [],
//   "outgoing": [{
//     "resourceId": "sid-4F6C23E3-480E-41C2-825E-9AAEC8329321"
//   }],
//   "bounds": {
//     "lowerRight": {
//       "x": 100.3125,
//       "y": 175
//     },
//     "upperLeft": {
//       "x": 60.90625,
//       "y": 175
//     }
//   },
//   "dockers": [{
//     "x": 15,
//     "y": 15
//   }, {
//     "x": 50,
//     "y": 40
//   }],
//   "target": {
//     "resourceId": "sid-4F6C23E3-480E-41C2-825E-9AAEC8329321"
//   }
// }, 
// {
//   "resourceId": "sid-C7366335-5A5E-45DB-A9DA-25748129080A",
//   "properties": {
//     "overrideid": "",
//     "name": "",
//     "documentation": "",
//     "sequencefloworder": ""
//   },
//   "stencil": {
//     "id": "ExclusiveGateway"
//   },
//   "childShapes": [],
//   "outgoing": [{
//     "resourceId": "sid-06E69942-EBC6-4588-8AC7-6F4EE1C876C6"
//   }, {
//     "resourceId": "sid-73F9E3E6-844B-4850-A41C-FAAAA3F4055A"
//   }],
//   "bounds": {
//     "lowerRight": {
//       "x": 294,
//       "y": 195
//     },
//     "upperLeft": {
//       "x": 254,
//       "y": 155
//     }
//   },
//   "dockers": []
// }, 
// {
//   "type": 0,
//   "resourceId": "sid-53F664E4-C8B5-47EC-8077-8078EFA9617D",
//   "properties": {
//     "nextResourceId": "sid-1826A3DB-AFC7-4449-B1F3-56AE4BD14B1C",
//     "overrideid": "zzh_node_2",
//     "name": "审核1",
//     "documentation": "",
//     "asynchronousdefinition": "false",
//     "exclusivedefinition": "false",
//     "executionlisteners": "",
//     "multiinstance_type": "None",
//     "multiinstance_cardinality": "",
//     "multiinstance_collection": "",
//     "multiinstance_variable": "",
//     "multiinstance_condition": "",
//     "isforcompensation": "false",
//     "usertaskassignment": {
//       "assignment": {
//         "candidateUsers": [{
//           "value": "#{user2}",
//           "$$hashKey": "2MQ"
//         }]
//       }
//     },
//     "formkeydefinition": "",
//     "duedatedefinition": "",
//     "prioritydefinition": "",
//     "formproperties": "",
//     "tasklisteners": ""
//   },
//   "stencil": {
//     "id": "UserTask"
//   },
//   "childShapes": [],
//   "outgoing": [{
//     "resourceId": "sid-04C1EF0B-5786-46B2-8731-6C89C1D40736"
//   }],
//   "bounds": {
//     "lowerRight": {
//       "x": 460,
//       "y": 137
//     },
//     "upperLeft": {
//       "x": 360,
//       "y": 57
//     }
//   },
//   "dockers": []
// }, 
// {
//   "type": 0,
//   "resourceId": "sid-45DF61EC-6FC2-40AE-9D7C-1AAFABC1C383",
//   "properties": {
//     "nextResourceId": "sid-1826A3DB-AFC7-4449-B1F3-56AE4BD14B1C" ,
//     "overrideid": "zzh_node_3",
//     "name": "审核2",
//     "documentation": "",
//     "asynchronousdefinition": "false",
//     "exclusivedefinition": "false",
//     "executionlisteners": "",
//     "multiinstance_type": "None",
//     "multiinstance_cardinality": "",
//     "multiinstance_collection": "",
//     "multiinstance_variable": "",
//     "multiinstance_condition": "",
//     "isforcompensation": "false",
//     "usertaskassignment": {
//       "assignment": {
//         "candidateUsers": [{
//           "value": "#{user3}",
//           "$$hashKey": "2QX"
//         }]
//       }
//     },
//     "formkeydefinition": "",
//     "duedatedefinition": "",
//     "prioritydefinition": "",
//     "formproperties": "",
//     "tasklisteners": ""
//   },
//   "stencil": {
//     "id": "UserTask"
//   },
//   "childShapes": [],
//   "outgoing": [{
//     "resourceId": "sid-7A16FD9A-A67B-49CF-B380-467CA26FFAFB"
//   }],
//   "bounds": {
//     "lowerRight": {
//       "x": 460,
//       "y": 305
//     },
//     "upperLeft": {
//       "x": 360,
//       "y": 225
//     }
//   },
//   "dockers": []
// }, 
// {
//   "resourceId": "sid-C6EE182A-C060-4D6F-865A-4F5894BBAB4B",
//   "properties": {
//     "overrideid": "",
//     "name": "",
//     "documentation": "",
//     "conditionsequenceflow": "",
//     "executionlisteners": "",
//     "defaultflow": "false"
//   },
//   "stencil": {
//     "id": "SequenceFlow"
//   },
//   "childShapes": [],
//   "outgoing": [{
//     "resourceId": "sid-C7366335-5A5E-45DB-A9DA-25748129080A"
//   }],
//   "bounds": {
//     "lowerRight": {
//       "x": 253.2382894454114,
//       "y": 175.41392020018384
//     },
//     "upperLeft": {
//       "x": 201.2070230545886,
//       "y": 175.20326729981616
//     }
//   },
//   "dockers": [{
//     "x": 50,
//     "y": 40
//   }, {
//     "x": 20.5,
//     "y": 20.5
//   }],
//   "target": {
//     "resourceId": "sid-C7366335-5A5E-45DB-A9DA-25748129080A"
//   }
// }, 
// {
//   "resourceId": "sid-06E69942-EBC6-4588-8AC7-6F4EE1C876C6",
//   "properties": {
//     "overrideid": "",
//     "name": "",
//     "documentation": "",
//     "conditionsequenceflow": "${pzOption==0}",
//     "executionlisteners": "",
//     "defaultflow": "false"
//   },
//   "stencil": {
//     "id": "SequenceFlow"
//   },
//   "childShapes": [],
//   "outgoing": [{
//     "resourceId": "sid-53F664E4-C8B5-47EC-8077-8078EFA9617D"
//   }],
//   "bounds": {
//     "lowerRight": {
//       "x": 359.71875,
//       "y": 175.5
//     },
//     "upperLeft": {
//       "x": 294.3671875,
//       "y": 97
//     }
//   },
//   "dockers": [{
//     "x": 20.5,
//     "y": 20.5
//   }, {
//     "x": 327,
//     "y": 175.5
//   }, {
//     "x": 327,
//     "y": 97
//   }, {
//     "x": 50,
//     "y": 40
//   }],
//   "target": {
//     "resourceId": "sid-53F664E4-C8B5-47EC-8077-8078EFA9617D"
//   }
// }, 
// {
//   "resourceId": "sid-73F9E3E6-844B-4850-A41C-FAAAA3F4055A",
//   "properties": {
//     "overrideid": "",
//     "name": "",
//     "documentation": "",
//     "conditionsequenceflow": "${pzOption==1}",
//     "executionlisteners": "",
//     "defaultflow": "false"
//   },
//   "stencil": {
//     "id": "SequenceFlow"
//   },
//   "childShapes": [],
//   "outgoing": [{
//     "resourceId": "sid-45DF61EC-6FC2-40AE-9D7C-1AAFABC1C383"
//   }],
//   "bounds": {
//     "lowerRight": {
//       "x": 359.71875,
//       "y": 265
//     },
//     "upperLeft": {
//       "x": 294.3671875,
//       "y": 175.5
//     }
//   },
//   "dockers": [{
//     "x": 20.5,
//     "y": 20.5
//   }, {
//     "x": 327,
//     "y": 175.5
//   }, {
//     "x": 327,
//     "y": 265
//   }, {
//     "x": 50,
//     "y": 40
//   }],
//   "target": {
//     "resourceId": "sid-45DF61EC-6FC2-40AE-9D7C-1AAFABC1C383"
//   }
// }, 
// {
//   "resourceId": "sid-1826A3DB-AFC7-4449-B1F3-56AE4BD14B1C",
//   "properties": {
//     "overrideid": "zzh_node_4",
//     "name": "批准会签",
//     "nextResourceId": "sid-3C3F06A1-91BC-47E5-A635-FC34E78074E9",
//     "documentation": "",
//     "asynchronousdefinition": "false",
//     "exclusivedefinition": "false",
//     "executionlisteners": "",
//     "multiinstance_type": "Parallel",
//     "multiinstance_cardinality": "",
//     "multiinstance_collection": "user4List",
//     "multiinstance_variable": "user4",
//     "multiinstance_condition": "${nrOfCompletedInstances/nrOfInstances >= 1}",
//     "isforcompensation": "false",
//     "usertaskassignment": {
//       "assignment": {
//         "candidateUsers": [{
//           "value": "#{user4}",
//           "$$hashKey": "3M1"
//         }]
//       }
//     },
//     "formkeydefinition": "",
//     "duedatedefinition": "",
//     "prioritydefinition": "",
//     "formproperties": "",
//     "tasklisteners": ""
//   },
//   "stencil": {
//     "id": "UserTask"
//   },
//   "childShapes": [],
//   "outgoing": [{
//     "resourceId": "sid-F72B2755-18F0-4652-BCBC-13E64146DD38"
//   }],
//   "bounds": {
//     "lowerRight": {
//       "x": 595,
//       "y": 215
//     },
//     "upperLeft": {
//       "x": 495,
//       "y": 135
//     }
//   },
//   "dockers": []
// }, 
// {
//   "resourceId": "sid-04C1EF0B-5786-46B2-8731-6C89C1D40736",
//   "properties": {
//     "overrideid": "",
//     "name": "",
//     "documentation": "",
//     "conditionsequenceflow": "",
//     "executionlisteners": "",
//     "defaultflow": "false"
//   },
//   "stencil": {
//     "id": "SequenceFlow"
//   },
//   "childShapes": [],
//   "outgoing": [{
//     "resourceId": "sid-1826A3DB-AFC7-4449-B1F3-56AE4BD14B1C"
//   }],
//   "bounds": {
//     "lowerRight": {
//       "x": 545,
//       "y": 135
//     },
//     "upperLeft": {
//       "x": 460.5703125,
//       "y": 97
//     }
//   },
//   "dockers": [{
//     "x": 50,
//     "y": 40
//   }, {
//     "x": 545,
//     "y": 97
//   }, {
//     "x": 50,
//     "y": 40
//   }],
//   "target": {
//     "resourceId": "sid-1826A3DB-AFC7-4449-B1F3-56AE4BD14B1C"
//   }
// }, 
// {
//   "resourceId": "sid-7A16FD9A-A67B-49CF-B380-467CA26FFAFB",
//   "properties": {
//     "overrideid": "",
//     "name": "",
//     "documentation": "",
//     "conditionsequenceflow": "",
//     "executionlisteners": "",
//     "defaultflow": "false"
//   },
//   "stencil": {
//     "id": "SequenceFlow"
//   },
//   "childShapes": [],
//   "outgoing": [{
//     "resourceId": "sid-1826A3DB-AFC7-4449-B1F3-56AE4BD14B1C"
//   }],
//   "bounds": {
//     "lowerRight": {
//       "x": 545,
//       "y": 265
//     },
//     "upperLeft": {
//       "x": 460.5703125,
//       "y": 215.375
//     }
//   },
//   "dockers": [{
//     "x": 50,
//     "y": 40
//   }, {
//     "x": 545,
//     "y": 265
//   }, {
//     "x": 50,
//     "y": 40
//   }],
//   "target": {
//     "resourceId": "sid-1826A3DB-AFC7-4449-B1F3-56AE4BD14B1C"
//   }
// }, 
{
  "resourceId": "sid-3C3F06A1-91BC-47E5-A635-FC34E78074E9",
  "properties": {
    "overrideid": "",
    "name": "",
    "documentation": "",
    "executionlisteners": ""
  },
  "stencil": {
    "id": "EndNoneEvent"
  },
  "childShapes": [],
  "outgoing": [],
  "bounds": {
    "lowerRight": {
      "x": 678,
      "y": 189
    },
    "upperLeft": {
      "x": 650,
      "y": 161
    }
  },
  "dockers": []
}, 
// {
//   "resourceId": "sid-F72B2755-18F0-4652-BCBC-13E64146DD38",
//   "properties": {
//     "overrideid": "",
//     "name": "",
//     "documentation": "",
//     "conditionsequenceflow": "",
//     "executionlisteners": "",
//     "defaultflow": "false"
//   },
//   "stencil": {
//     "id": "SequenceFlow"
//   },
//   "childShapes": [],
//   "outgoing": [{
//     "resourceId": "sid-3C3F06A1-91BC-47E5-A635-FC34E78074E9"
//   }],
//   "bounds": {
//     "lowerRight": {
//       "x": 649.984375,
//       "y": 175
//     },
//     "upperLeft": {
//       "x": 595.2734375,
//       "y": 175
//     }
//   },
//   "dockers": [{
//     "x": 50,
//     "y": 40
//   }, {
//     "x": 14,
//     "y": 14
//   }],
//   "target": {
//     "resourceId": "sid-3C3F06A1-91BC-47E5-A635-FC34E78074E9"
//   }
// }
]
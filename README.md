# psx-overseer
psx-overseer is an observer pattern based package for node.

# Installation
---
>npm install psx-overseer
#Usage
---
First, require overseer.
```
const psx-overseer = require('psx-overseer');
```

- ###### define overseer

Now `define` a overseer.

`define(overseerid: string, rate: number)`
```
const bigBrother = psx-overseer.define('big-brother');
```
'rate' here means 'sub frequency rate'.
You can read the code for more detail.

- ###### get overseer

Or get a defined overseer at anywhere.
`get(overseerid: string)`
```
const bigBrother = psx-overseer.get('big-brother');
```
- ###### define task
Define a new task on an overseer;
`defineTask({cycle: number, taskId: string, update: function, getter: function})`

```
bigBrother.defineTask({
  cycle: 60 * 1000,
  taskId: 'bangumi',
  update:  () => {}, //provide any function
  getter:  () => {}, //provide any function
}
```

- ###### remove task
Remove a task
`removeTask(taskId: string)`
```
bigBrother.removeTask('bangumi');
```

- ###### get data
To get all the data that your overseer collected.
`getData()`
```
bigBrother.getData();
```

- ###### get task
If you want to modified a task, you can get that task by  `getTask()` on the overseer.
`getTask(taskid)`
```
bigBrother.getTask('bangumi');
```
#features
---
- ###### sub frequency rate
Overseer check every task by a calculated checkCycle.
>checkCycle = minCycle in all task / sub frequency rate

The default of sub frequency rate is `4`.
You can provide a getter number for stronger performance when `define()` a overseer.

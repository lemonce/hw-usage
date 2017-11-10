'use strict';

const _ = require('./util');

const SUB_FREQUENCY_RATE = 4;

const overseerPool = {};

class Overseer {
	constructor(rate = SUB_FREQUENCY_RATE) {
		this._watcherId = null;
		this._taskList = {};
		this.rate = rate;
	}

	defineTask(...args) {
		const taskList = _.flattenDeep(new Array(args));

		_.forEach(taskList, task => {
			const { cycle, taskId, update, getter } = task;

			if (!_.isNumber(cycle)) {
				throw new Error('The task cycle should be a number.');
			}

			if (cycle < 0) {
				throw new Error('The task cycle cannot be a negative number.');
			}
	
			if (!_.isUndefined(this._taskList[taskId])) {
				throw new Error('The name of task is repeat.');
			}
	
			if (!_.isFunction(update)) {
				throw new Error('The update should be a function.');
			}
			
			this._taskList[taskId] = new Task(cycle, taskId, update, getter);
		});	

		this._restart();
	}

	removeTask(taskId) {
		delete this._taskList[taskId];

		this._restart();
	}

	_restart() {
		clearInterval(this._watcherId);
		this._watcherId = null;

		if (_.isEmpty(this._taskList)) {
			return;
		}

		this._watcherId = setInterval(() => {
			this._watcherHandler();
		}, this._computeWatcherCycle());
	}

	_watcherHandler() {
		_.forEach(this._taskList, task => {
			if (!task.needUpdate()) {
				return;
			}
	
			task.update();
		});
	}

	_computeWatcherCycle() {
		let minCycle = Number.MAX_VALUE;
		
		_.forEach(this._taskList, task => {
			minCycle = Math.min(minCycle, task.cycle);
		});
	
		return Math.ceil(minCycle / this.rate);
	}

	getData() {
		const data = {};

		_.forEach(this._taskList, task => {
			data[task.id] = task.getData();
		});

		return data;
	}

	getTask(id) {
		return this._taskList[id];
	}
}

class Task {
	constructor(cycle, id, update, getter) {
		this.cycle = cycle;
		this.id = id;
		
		this._update = update;
		this._getter = getter;
		this._updatetime = 0;
	}

	update() {
		return Promise.resolve(this._update())
			.then(() => this._updatetime = Date.now());	
	}

	needUpdate() {
		return Date.now() - this._updatetime > this.cycle;
	}
	
	getData() {
		return this._getter();
	}
}

exports.define = function defineOverseer(overseerId, rate) {
	if (!_.isString(overseerId)) {
		throw new Error('overseerId is not string!');
	}

	if (overseerPool.hasOwnProperty(overseerId)) {
		throw new Error('overseerId is repeat!');
	}

	return overseerPool[overseerId] = new Overseer(rate);
};

exports.get = function getOverseer(overseerId) {
	if (!_.isString(overseerId)) {
		throw new Error('overseerId is not string!');
	}

	if (_.isUndefined(overseerPool[overseerId])) {
		throw new Error('overseerId is not defined!\n\t[' +
			Object.keys(overseerPool).join(', ') + ']');
	}

	return overseerPool[overseerId];
};
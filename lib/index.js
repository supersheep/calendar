/**
 * Calendar 组件，用于渲染日历
 */
"use strict";

/**
 * Usage:
 * new Calendar(container,options);
 *
 * Options:
 * date: defaultDate
 */
var $ = require("jquery");
var _ = require("underscore");
var Class = require("class");

var PREFIX = "ui-calendar";
var CLASS_SPLITER = "-";
// 无效日期
var CLASS_INVALID = [PREFIX, "invalid"].join(CLASS_SPLITER);
// 可选日期
var CLASS_AVAIL = [PREFIX, "available"].join(CLASS_SPLITER);
// 星期
var CLASS_WEEK = [PREFIX, "week"].join(CLASS_SPLITER);
// 容器
var CLASS_WRAPPER = [PREFIX, "wrapper"].join(CLASS_SPLITER);
// 日期
var CLASS_DATE = [PREFIX, "date"].join(CLASS_SPLITER);
// 默认日期
var CLASS_DATE_DEFAULT = [PREFIX, "date", "default"].join(CLASS_SPLITER);

var now = new Date();
var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

var Calendar = Class({
	Implements: "events attrs",
	initialize: function(container, options) {
		var self = this;
		options = options || {};
		this.set("container", container);
		this.set("weekdays", options.weekdays);
		this.set("firstDay", options.firstDay);
		this.set("defaultDate", options.defaultDate || today);
		this.set("renderDay", options.renderDay);
		this.set("availableDays", options.availableDays);
		self._render();
	},
	setYear: function(year) {
		this.set('year', year);
		this._render();
		this.emit('change');
	},
	setMonth: function(month) {
		this.set('month', month);
		this._render();
		this.emit('change');
	},
	/**
	 * 跳转至去年
	 * @return {[type]}
	 */
	setAvailableDates: function(avail) {
		this.set('availableDays', avail);
		this._refreshDays();
	},
	/**
	 * 跳转至去年
	 * @return {[type]}
	 */
	prevYear: function() {
		this.setYear(this.get('year') - 1);
		this._render();
	},
	/**
	 * 跳转至明年
	 * @return {[type]}
	 */
	nextYear: function() {
		this.setYear(this.get('year') + 1);
		this._render();
	},
	/**
	 * 跳转上一月
	 * @return {[type]}
	 */
	prevMonth: function() {
		var prevMonth = this.get('month') - 1;
		if (prevMonth < 0) {
			this.setMonth(11);
			this.prevYear();
		} else {
			this.setMonth(prevMonth);
		}
		this._render();
	},
	/**
	 * 跳转下一月
	 * @return {[type]}
	 */
	nextMonth: function() {
		var nextMonth = this.get('month') + 1;
		if (nextMonth > 12) {
			this.setMonth(1);
			this.nextYear();
		} else {
			this.setMonth(nextMonth);
		}
		this._render();
	},

	_isLastMonth: function(date) {
		var month = date.getMonth();
		return month < this.get('month');
	},
	_isNextMonth: function(date) {
		var month = date.getMonth();
		return month > this.get('month') || (month == 0 && this.get('month') == 11)
	},
	_renderWeek: function() {
		var weekdays = this.get('weekdays'),
			firstDay = this.get('firstDay'),
			text = null,
			ul = $('<tr />');

		for (var i = 0; i < 7; i++) {
			text = weekdays[(i + firstDay) % 7];
			$('<th />').addClass(CLASS_WEEK).html(text).appendTo(ul);
		}
		return ul;
	},
	_renderDays: function() {
		var ret = [],
			renderDay = this._renderDay,
			currentDate = this.calfirst,
			td = null;


		for (var i = 0; i < 6; i++) {
			var tr = $('<tr />');
			for (var j = 0; j < 7; j++) {
				td = this._renderDay(currentDate);
				tr.append(td);
				currentDate = new Date(
					currentDate.getFullYear(),
					currentDate.getMonth(),
					currentDate.getDate() + 1
				);

			}
			ret.push(tr);
		}
		return ret;
	},
	_refreshDays: function() {
		var self = this;
		this.wrap.find("td").each(function(i, td) {
			self._refreshDay(td);
		});
	},
	/**
	 * 更新
	 * @param  {[type]} td
	 * @return {[type]}
	 */
	_refreshDay: function(td) {
		td = $(td);
		var self = this;
		var date = td.data("date");
		var defaultDate = this.get("defaultDate");
		if (!date) {
			return;
		}

		if (this._isLastMonth(date)) {
			td.addClass('last_month').addClass(CLASS_INVALID);
		} else if (this._isNextMonth(date)) {
			td.addClass('next_month').addClass(CLASS_INVALID);
		} else {
			if (this.get('availableDays')(date)) {
				td.removeClass(CLASS_INVALID).addClass(CLASS_AVAIL);
			} else {
				td.removeClass(CLASS_AVAIL).addClass(CLASS_INVALID);
			}
		}
		var dateString = date.toDateString();
		if (dateString === new Date().toDateString()) {
			td.addClass('today');
		}
		if (dateString === defaultDate.toDateString()) {
			td.addClass(CLASS_DATE_DEFAULT);
		}
		return td;
	},
	_renderDay: function(date) {
		var self = this;
		var td = $('<td />').addClass(CLASS_DATE);
		var themonth = date.getMonth();
		var customRenderDay = this.get('renderDay');
		td.data("date", date);

		td.html(date.getDate());

		self._refreshDay(td);
		customRenderDay && customRenderDay(td, date);
		return td;
	},
	_render: function() {


		var self = this;
		var container = self.get('container');
		var wrap = self.wrap = $("<table />").addClass(CLASS_WRAPPER);
		var firstday = new Date(this.get('year'), this.get('month'), 1);
		var firstWeekDay = self.get('firstDay');

		container.empty();

		var firstDate = 1 + firstWeekDay - firstday.getDay();
		self.calfirst = new Date(
			firstday.getFullYear(), firstday.getMonth(), firstDate > 0 ? firstDate - 7 : firstDate // 当月第一天减去星期数
		);
		var weektitle = self._renderWeek();
		var days = self._renderDays();


		weektitle.appendTo(wrap);
		days.forEach(function(line) {
			line.appendTo(wrap);
		});
		container.append(self.wrap);
		self._bind();
		return self;
	},
	_bind: function() {
		var self = this;
		var wrap = self.wrap;
		// bind
		wrap.on("mouseleave", function() {
			self.emit("mouseleave");
		});

		wrap.on("click", "td", function() {
			var td = $(this);
			var date = td.data("date");
			if (!td.hasClass(CLASS_INVALID)) {
				self.emit("pick", date, $(this));
			}
		});

		wrap.on("mouseenter", "td", function() {
			var date = $(this).data("date");
			self.emit("hover", date, $(this));
		});
	}
}, {
	'container': {
		setter: function(container) {
			return $(container);
		}
	},
	'firstDay': {
		value: 0,
		validator: _.isNumber,
		setter: function(day) {
			return day % 7;
		}
	},
	'weekdays': {
		validator: _.isArray,
		value: '日一二三四五六'.split('')
	},
	'renderDay': {
		validator: _.isFunction,
		value: function() {}
	},
	'availableDays': {
		validator: _.isFunction,
		value: function(date) {
			return true
		}
	},
	'defaultDate': {
		validator: _.isDate,
		value: today,
		setter: function(date) {
			this.set('year', date.getFullYear());
			this.set('month', date.getMonth());
			this.set('date', date.getDate());
			return date;
		}
	},
	'year': {
		validator: _.isNumber,
		setter: function(year) {
			return year;
		}
	},
	'humanMonth': {
		getter: function() {
			return this.get('month') + 1;
		}
	},
	'month': {
		validator: _.isNumber,
		setter: function(month) {
			return month % 12;
		},
		getter: function(month) {
			return month;
		}
	},
	'date': {}
});

module.exports = function(container, options) {
	return new Calendar(container, options);
};

module.exports.Calendar = Calendar;

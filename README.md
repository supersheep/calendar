# calendar

generate calendar structure easily
[![Build Status](http://browserman.dp:9000/api/app/calendar/badge)](http://search.cortexjs.org/package/calendar)

## Install

```bash
$ cortex install calendar --save
```


## Usage

```js
var calendar = require('calendar');
calendar(selector,options);
```


### Class: Calendar(selector, options)

```js
new Calendar("#calendar-wrapper",{
  firstDay: 0, // Sunday as firstday
  defaultDate: new Date(), // today as default date
  renderDay: function(td){}
  
});
```

- selector `String|DOMElement` container to create calendar in.

Creates a new calendar instance.

#### options.weekday `Array` ['日','一','二','三','四','五','六']

  weekdays as titles

#### options.defaultDate `Date` new Date()

  default date to show

#### options.firstDay `Number` 0

  first week day, 0 presents for Sunday.

#### options.renderDay `Function` function(td){}

  render the td for custom requirements

#### options.availiableDays `Function` function(date){}

  return true if the passing date is availiable


#### .setYear()

  set year and rerender calendar

#### .setMonth()
  
  set month and rerender calendar

#### .prevYear()
  
  switch to previous year

#### .nextYear()

  switch to next year

#### .prevMonth()
    
  switch to last month

#### .nextMonth()
  
  switch to next month

#### .setAvailableDates(func)
  
  Set available dates.
  The passing function is same as `options.availiableDays`


#### Event: 'mouseleave'

emits when mouseleave the calendar container

- e `Object` the first parameter of the callback


#### Event: 'pick'

emits when available date is clicked

- date: the date you picked
- elem: the DOM Element of the date

#### Event: 'hover'

emits when date is hovered

- date: the date you hover
- elem: the DOM Element of the date



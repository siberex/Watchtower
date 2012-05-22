var db = require('google/appengine/ext/db');
var {Host} = require('models/host');

// Чтобы приложение присвоило собственный идентификатор, который будет использован в ключе,
// задайте аргумент keyName в конструкторе экземпляра:
// new Subscriber({keyName: 'abc123'});
// Значение key_name не может начинаться с цифры и иметь форму __*__
// Полный ключ присваивается объекту во время создания в хранилище данных, и впоследствии его компоненты не могут быть изменены.
var Subscriber = exports.Subscriber = db.Model('Subscriber', {
  email     : new db.EmailProperty({required: true}),
  host      : new db.ReferenceProperty({referenceClass: Host, required: true}),
  updated   : new db.DateTimeProperty({autoNowAdd: true}),
  notificationTriggers : new db.ListProperty({itemType: db.BooleanProperty})
});

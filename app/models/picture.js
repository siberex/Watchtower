var db = require('google/appengine/ext/db');
var {Album} = require('models/album');
var {File} = require('models/file');

// Чтобы приложение присвоило собственный идентификатор, который будет использован в ключе,
// задайте аргумент keyName в конструкторе экземпляра:
// new Picture({keyName: 'abc123'});
// Значение key_name не может начинаться с цифры и иметь форму __*__
// Полный ключ присваивается объекту во время создания в хранилище данных, и впоследствии его компоненты не могут быть изменены.
var Picture = exports.Picture = db.Model('Picture', {
  title     : new db.StringProperty(),
  file      : new db.ReferenceProperty({referenceClass: File, required: true}),
  updated   : new db.DateTimeProperty({autoNowAdd: true}),
  summary   : new db.TextProperty(),
  album     : new db.ReferenceProperty({referenceClass: Album}),
  tags      : new db.ListProperty({itemType: db.Category})
});

var db = require('google/appengine/ext/db');
var {File} = require('models/file');

// Чтобы приложение присвоило собственный идентификатор, который будет использован в ключе,
// задайте аргумент keyName в конструкторе экземпляра:
// new Album({keyName: 'abc123'});
// Значение key_name не может начинаться с цифры и иметь форму __*__
// Полный ключ присваивается объекту во время создания в хранилище данных, и впоследствии его компоненты не могут быть изменены.
var Album = exports.Album = db.Model('Album', {
  title     : new db.StringProperty({required: true, unique: true}), // Не более 500 байт.
  // CategoryProperty in future?
  url       : new db.StringProperty(),
  summary   : new db.TextProperty(), // Не индексируется, порядок сортировки и фильтры не сработают.
  cover     : new db.ReferenceProperty({referenceClass: File}),
  updated   : new db.DateTimeProperty({autoNowAdd: true}),
  isHidden  : new db.BooleanProperty()
});

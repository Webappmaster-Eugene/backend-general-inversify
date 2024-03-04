import fs from 'fs';
import events from 'events';
function reader () {
    fs.readFile('./data.txt', (err, data) => {
        console.log(data.toString());
    });
}
reader();

const EventEmitter = new events();

const logDbConnection = () => {
    console.log('DB connected');
}

// EventEmitter.addListener('connected', logDbConnection);
// EventEmitter.off('connected', logDbConnection);
// EventEmitter.emit('connected');

EventEmitter.on('msg', (data) => {console.log('Poluchil data: ' + data)});

EventEmitter.emit('msg', 'Privet!');

console.log(EventEmitter.eventNames());

EventEmitter.on('error', (err) => {
    console.log('Proizaoshla oshibka', err.message);
});

EventEmitter.emit('error', new Error('boom'));
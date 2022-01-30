const EventEmitter = require('events');

class School extends EventEmitter {
    startPeriod(){
        console.log('Class is started');

        //raise an event when bell rings
        //raise an event
        setTimeout( () => {
            this.emit('bellRing', {
                period: 'third',
                text: 'run Barry run!!!!'
            });
        }, 2000);
    }
}

module.exports = School;
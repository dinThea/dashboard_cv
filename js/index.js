const Url = 'http://192.168.0.14:3000/cams'

var sidebar = new Vuex.Store({
    
    types: {
        TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR'
    },

    state: {
        sidebarOpen: false
    },

    getters: { 
        sidebarOpen: state => state.sidebarOpen
    },

    actions: {
        toggleSidebar: function toggleSidebar( commit, state, types ) {
            commit(types.TOGGLE_SIDEBAR);
        } 
    }, 

    mutations: {
        TOGGLE_SIDEBAR: function TOGGLE_SIDEBAR(state) { 
            state.sidebarOpen ^= true
        }
    }

})

var store = new Vuex.Store({
    state: {
        // initial state
        servers: [
            { name: 'Inativo', status: true, adr: '192.168.0.24' },
            { name: 'Inativo', status: true, adr: '192.168.0.25', type: 'database' },
            { name: 'Inativo', status: true, adr: '192.168.0.26', type: 'database' },
            { name: 'Inativo', status: true, adr: '192.168.0.37' },
            { name: 'Inativo', status: true, adr: '192.168.0.17' },
            { name: 'Inativo', status: true, adr: '192.168.0.23' },
            { name: 'Inativo', status: true, adr: '192.168.0.47' },
            { name: 'Inativo', status: true, adr: '192.168.0.127' }
        ] 
    },

    mutations: {
        UPDATE_SERVER_STATUS: function UPDATE_SERVER_STATUS(state, payload) {
            state.servers[payload].status ^= true;
        } 
    },

    actions: {
        serverStatus: function serverStatus(_ref, server) {
            var commit = _ref.commit;
            commit('UPDATE_SERVER_STATUS', server);
        } 
    } 
});

Vue.component('dashboard-clock', {
    props: {
        digital: {
            default: true,
            type: Boolean },

        binary: {
            default: false,
            type: Boolean } },


    data: function data() {
        return {
            time: '' };

    },
    template: '\n    <div class=\'dashboard-clock\'>\n        <div v-if="digital" class="dashboard-clock-digital">{{time}}</div>\n        <table v-if="binary" class="dashboard-clock-binary">\n            <tr class=\'hours\'>\n                <td v-for=\'n in 6\'></td>\n            </tr>\n            <tr class=\'minutes\'>\n                <td v-for=\'n in 6\'></td>\n            </tr>\n            <tr class=\'seconds\'>\n                <td v-for=\'n in 6\'></td>\n            </tr>\n        </table>\n    </div>\n    ',

    mounted: function mounted() {
        window.setInterval(this.render, 1000);
    },
    methods: {
        render: function render() {
            var d = new Date();
            var h = d.getHours();
            var m = d.getMinutes();
            var s = d.getSeconds();

            this.time = this.addZero(h) + ' : ' + this.addZero(m) + ' : ' + this.addZero(s);

            this.light(this.convert(s), '.seconds');
            this.light(this.convert(m), '.minutes');
            this.light(this.convert(h), '.hours');
        },
        convert: function convert(num) {
            var bin = "";
            var conv = [];

            while (num > 0) {
                bin = num % 2 + bin;
                num = Math.floor(num / 2);
            }

            conv = bin.split('');

            while (conv.length < 6) {
                conv.unshift("0");
            }

            return conv;
        },
        light: function light(array, type) {
            $(type + ' td').attr('class', 'num0');
            for (var i = 0; i < array.length; i++) {
                $(type + ' td:eq(' + i + ')').attr('class', 'num' + array[i]);
            }
        },
        addZero: function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        } } });

Vue.component('dashboard-header', {
    props: ['title'],
    template: '\n    <header class="dashboard-header">\n        <h1 class="dashboard-title">{{title}}</h1>\n        <slot></slot>\n    </header>\n    ' });

Vue.component('server-list', {
    template: '<div class="server-list"><slot></slot></div>' 
});

Vue.component('server', {
    props: ['type'],
    template: '\n    <div class="server">\n        <div class="server-icon fa" \n            :class="\'fa-\' + (type === \'database\' ? \'tasks\' : \'globe\')">\n        </div>\n        <ul class="server-details">\n            <li>Hostname:<slot name="name"></slot></li>                         \n            <li>Status:<slot name="status"></slot></li>\n            <li>Address:<slot name="adr"></slot></li>\n        </ul>\n    </div>' });

Vue.component('responsible-sidebar', {
    template: '<div class="sidebar"><slot></slot></slot></div>' 
});

var sidebar = new Vue({
    el: 'sidebar',
    data: function data() {
        return {
            options: fields.options
        };
    },
    methods: {
        expandSidebar: function expandSidebar() {
            console.log('expanding')
            
        }
    }
})    
//Vue.use(Vuex);
var dashboard = new Vue({
    el: 'dashboard',
    data: function data() {
        return {
            servers: store.state.servers };
    },
    methods: {
        updateServerStatus: function updateServerStatus(server) {
            console.log('status')
            store.dispatch('serverStatus', server);
        },
        get: function get(){
            console.log(Url)
            this.$http.get(Url).then((response) => {
                console.log(response)
            })
        }
    },

    mounted: function mounted() {
        var _this = this;
        setInterval(function () {
            return (
                store.dispatch('serverStatus',
                Math.floor(Math.random() * (_this.servers.length - 0) + 0)));
            },
        5000);
    } 
});
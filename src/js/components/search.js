var Search = Backbone.View.extend({

    options: {
    },

    ui: {
        input: '.class'
    },

    events: {
        'click .btn': '_onClickBtn'
    },


    initialize: function(options) {
        this.options = _.defaults(options || {}, this.options);
    },

    _onClickBtn: function() {
        this.submitForm();
    }
});

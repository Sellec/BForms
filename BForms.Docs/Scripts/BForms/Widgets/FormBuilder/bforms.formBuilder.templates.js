﻿var factory = function ($) {

    var wrapperTemplates = {
        formGroup: '<div class="form-group {{cssClass}} col-lg-{{colLg}} col-md-{{colMd}} col-sm-{{colSm}} col-xs-{{colXs}} {{validationCss}}">' +
                       '{{{label}}}' +
                       '<div class="input-group">' +
                           '{{{addon}}}' +
                           '{{{control}}}' +
                           '{{{validation}}}' +
                           '{{#controlAddons}}' +
                               '<span class="input-group-addon glyphicon glyphicon-{{glyphicon}}" data-addon-toggle="{{name}}"></span>' +
                           '{{/controlAddons}}' +
                       '</div>' +
                   '</div>',
        formControlWrapper: '<div class="form_builder-formControlWrapper col-lg-{{colLg}} col-md-{{colMd}} col-sm-{{colSm}} col-xs-{{colXs}} border">' +
                                '<div class="row">' +
                                    '<div class="col-lg-11 col-md-11 col-sm-11 col-xs-8">' +
                                        '{{{control}}}' +
                                    '</div>' +
                                    '<div class="col-lg-1 col-md-1 col-sm-1 col-xs-4 form-group">' +
                                        '<label class="control-label"></label>' +
                                        '<div class="input-group">' +
                                            '<button class="btn btn-white pull-left">cacat</button>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '</div>',

        controlListItem: '<li class="form_builder-controlItem list-group-item" data-controltype="{{type}}" data-position="{{order}}" data-name="{{name}}" data-glyphicon="{{glyphicon}}">' +
                            '<span class="form_builder-controlItem-glyphicon {{glyphicon}} glyphicon"></span>' +
                            '<a class="badge form_builder-controlItem-add">' +
                                '<span class="glyphicon glyphicon-plus"></span>' +
                            '</a>' +
                            ' {{name}}' +
                         '</li>',

        propertiesTab: '<div class="row">' +
                        '<div class="col-lg-12 col-md-12 col-sm-12">' +
                            '<div class="row">' +
                                '{{#tabs}}' +
                                    '<div class="col-lg-12 col-md-12 col-sm-12">' +
                                        '<h3 class="bs-editable">' +
                                            '<span class="glyphicon glyphicon-{{glyphicon}}"></span>' +
                                            '<a href="#">{{name}}</a>' +
                                            '<span class="glyphicon glyphicon-pencil pull-right"></span>' +
                                        '</h3>' +

                                    '</div>' +
                                    '<div class="col-lg-12 col-md-12 col-sm-12">' +
                                        '{{{controls}}}' +
                                    '</div>' +
                                '{{/tabs}}' +
                            '</div>' +
                        '</div>' +
                     '</div>',

        controlProperties: '{{#tabs}}' +
                               '<div class="col-lg-12 col-md-12 col-sm-12">' +
                                   '<h3 class="bs-editable">' +
                                       '<span class="glyphicon glyphicon-{{glyphicon}}"></span>' +
                                       '{{name}}' +
                                   '</h3>' +
                               '</div>' +
                           '{{/tabs}}'


    };

    var validationTemplates = {
        validation: '<span class="input-group-addon glyphicon glyphicon-warning-sign {{#invalid}}field-validation-invalid{{/invalid}}{{^invalid}}field-validation-valid{{/invalid}}" data-toggle="tooltip" data-valmsg-for="{{controlName}}" data-valmsg-replace="{{replace}}"></span>',
        validationCss: '{{#invalid}}has-error{{/invalid}}{{^invalid}}{{/invalid}}'
    };

    var helperTemplates = {
        glyphiconAddon: '<span class="glyphicon glyphicon-{{glyphicon}} input-group-addon"></span>'
    };

    var controlsTemplates = {

        label: '<label class="control-label {{#required}}required{{/required}}{{^required}}{{/required}}" for="{{controlId}}">' +
                   '{{text}}' +
               '</label>',

        input: '<input class="form-control {{cssClass}}" type="{{type}}" id="{{id}}" name="{{name}}" value="{{value}}" placeholder="{{placeholder}}" />',

        dropdown: '<select class="form-control bs-dropdown" id="{{id}}" name="{{name}}" tabindex="-1">' +
                      '{{#items}}' +
                          '<option value="{{value}}">{{text}}</option>' +
                      '{{/items}}' +
                  '</select>',

        radioButtonList: '<div class="form-control bs-radio-list radioButtonList-done {{cssClass}}" data-initialvalue="{{initialValue}}" id="{{id}}" style="display:none;">' +
                            '{{#items}}' +
                                '<div>' +
                                    '<input data-initialValue="{{initialValue}}" id="{{id}}" name="{{controlName}}" type="radio" value="{{value}}" {{#selected}}checked="checked"{{/selected}}/>' +
                                    '<label for="{{id}}">{{label}}</label>' +
                                '</div>' +
                            '{{/items}}' +
                         '</div>',

        textArea: '<textarea class="form-control bs-textarea {{cssClass}} cols="20" rows="2" name="{{name}}" id="{{id}}"></textarea>',

        tagList: '<select id="{{id}}" name="{{name}}" multiple="multiple" class="form-control bs-tag-list bs-hasBformsSelect" style="display:none;">' +
                            '{{#items}}' +
                                '<option value="{{value}}">{{text}}</option>' +
                            '{{/items}}' +
                        '</select>',

        listBox: '<select class="form-control bs-listbox select2-offscreen bs-hasBformsSelect" id="{{id}}" name="{{name}}" multiple="multiple" tabindex="-1">' +
                    '{{#items}}' +
                        '<option value="{{value}}">{{text}}</option>' +
                    '{{/items}}' +
                 '</select>',

        formTitle: '<div class="col-lg-12 col-md-12 col-sm-12">' +
                        '<h4 class="form-title">' +
                           '<span class="glyphicon {{glyphicon}}"></span>' +
                           ' {{text}}' +
                       '</h4>' +
                   '</div>',

        datePicker: '<input class="form-control bs-datetime " id="{{textValueId}}" name="{{textValueName}}" type="text" value="{{textValue}}" data-minvalue="{{minValue}}" data-maxvalue="{{maxValue}}">' +
                    '<input class="bs-date-iso" data-for="{{textValueName}}" id="{{dateValueId}}" name="{{dateValueName}}" type="hidden" value="{{dateValue}}">',

        datePickerRange: '<input class="form-control bs-datetime-range" data-maxvalue="{{maxValue}}" data-minvalue="{{minValue}}" id="{{textValueId}}" name="{{textValueName}}" placeholder="{{placeHolder}}" type="text" value="{{value}}">' +
                         '<input class="bs-range-from" data-allowdeselect="{{fromAllowDeselect}}" data-for="{{textValueName}}" id="{{fromId}}" name="{{fromName}}" type="hidden" value="{{fromValue}}" data-minvalue="{{fromMinValue}}" data-maxvalue="{{fromMaxValue}}">' +
                         '<input class="bs-range-to" data-allowdeselect="{{toAllowDeselect}}" data-for="{{textValueName}}" id="{{toId}}" name="{{toName}}" type="hidden" value="{{toValue}}" data-minvalue="{{toMinValue}}" data-maxvalue="{{toMaxValue}}">',

        checkBox: 'Do we really need a checkbox? :-/',

        checkBoxList: '<div class="form-control bs-checkbox-list checkBoxList-done" id="{{id}}" style="display:none;">' +
                          '{{#items}}' +
                              '<div>' +
                                  '<input data-value="{{value}}" id="{{id}}" name="{{controlName}}" type="checkbox" />' +
                                  '<input name="{{controlName}}" type="hidden" value="{{#selected}}true{{/selected}}{{^selected}}false{{/selected}}"/>' +
                                  '<label for="{{id}}">{{label}}</label>' +
                              '</div>' +
                          '{{/items}}' +
                      '</div>' +
                      '<div tabindex="0" id="{{name}}_checkBox" class="checkbox_replace form-control">' +
                        '<div class="btn-group-justified">' +
                            '{{#items}}' +
                                '<a data-value="{{value}}" class="option">{{label}}</a>' +
                            '{{/items}}' +
                        '</div>' +
                      '</div>'
    };

    var templates = $.extend(true, {}, wrapperTemplates, validationTemplates, controlsTemplates, helperTemplates);

    return templates;
};

if (typeof define == 'function' && define.amd) {
    define('bforms-formBuilder-templates', ['jquery', 'bforms-datepicker'], factory);
} else {
    factory(window.jQuery);
}
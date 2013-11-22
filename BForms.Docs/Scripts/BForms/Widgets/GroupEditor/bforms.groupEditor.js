﻿define('bforms-groupEditor', [
    'jquery',
    'jquery-ui-core',
    'bforms-pager',
    'bforms-ajax',
    'bforms-namespace',
    'bforms-inlineQuestion',
    'bforms-form'
], function () {

    //#region Constructor and Properties
    var GroupEditor = function (opt) {
        this.options = $.extend(true, {}, this.options, opt);
        this._init();
    };

    GroupEditor.prototype.options = {
        uniqueName: '',

        tabsSelector: '.bs-tabs',
        groupsSelector: '.bs-groups',

        navbarSelector: '.bs-navbar',
        toolbarBtnSelector: '.bs-toolbarBtn',
        editorFormSelector: '.bs-editorForm',
        pagerSelector: '.bs-pager',
        tabContentSelector: '.bs-tabContent',
        tabItemSelector: '.bs-tabItem',

        groupItemSelector: '.bs-groupItem',

        removeBtn: '.bs-removeBtn',
        addBtn: '.bs-addBtn',
        editBtn: '.bs-editBtn',

        getTabUrl: '',
    };
    //#endregion

    //#region Init
    GroupEditor.prototype._init = function () {

        if (!this.options.uniqueName) {
            this.options.uniqueName = this.element.attr('id');
        }

        if (!this.options.uniqueName) {
            throw 'grid needs a unique name or the element on which it is aplied has to have an id attr';
        }

        this._initSelectors();

        this._addDelegates();

        this._initSelectedTab();

        this._initTabForms();
    };

    GroupEditor.prototype._initSelectors = function () {

        this.$navbar = this.element.find(this.options.navbarSelector);

        this.$tabs = this.element.find(this.options.tabsSelector);

        this.$groups = this.element.find(this.options.groupsSelector);
    };

    GroupEditor.prototype._addDelegates = function () {
        this.$navbar.on('click', 'a', $.proxy(this._evChangeTab, this));
        this.$tabs.find('div[data-tabid]').on('click', 'button' + this.options.toolbarBtnSelector, $.proxy(this._evChangeToolbarForm, this));
        this.$tabs.on('click', this.options.addBtn, $.proxy(this._evAdd, this));
        this.$groups.on('click', this.options.removeBtn, $.proxy(this._evRemove, this));
        this.$groups.on('click', this.options.editBtn, $.proxy(this._evEdit, this));
    };

    GroupEditor.prototype._initSelectedTab = function () {
        this._initTab(this._getSelectedTab());
    };

    GroupEditor.prototype._initTabForms = function () {
        var forms = this.element.find(this.options.editorFormSelector);

        $.each(forms, function (idx) {
            $(this).bsForm({
                uniqueName: $(this).data('uid') + idx
            });
        });
    };

    GroupEditor.prototype._initTab = function (tabModel) {
        var self = this;
        if (tabModel) {
            var checkItems = true;
            if (!tabModel.loaded) {
                checkItems = false;
                this._ajaxGetTab({
                    tabModel: tabModel,
                    data: {
                        TabId: tabModel.tabId
                    }
                });
            }
            if (tabModel.html) {
                tabModel.container.find(this.options.tabContentSelector).html(tabModel.html);
            }
            if (!tabModel.pager) {
                tabModel.pager = tabModel.container.find(this.options.pagerSelector);
                tabModel.pager.bsPager({
                    pagerUpdate: function (e, data) {
                        self._evChangePage(data, tabModel);
                    },
                    pagerGoTop: $.proxy(this._evGoTop, this)
                });
            }
            tabModel.container.show();
            if (checkItems) { 
                this._checkItems();
            }
        }
    };
    //#endregion

    //#region Events
    GroupEditor.prototype._evChangeToolbarForm = function (e) {
        var $el = $(e.currentTarget),
            uid = $el.data('uid'),
            tab = this._getSelectedTab(),
            $container = tab.container,
            visibleForm = $container.find("div[data-uid]:visible"),
            visibleUid = visibleForm.data('uid');

        visibleForm.slideUp();

        if (visibleUid != uid) {
            $container.find("div[data-uid='" + uid + "']").slideDown();
        }
    };

    GroupEditor.prototype._evChangeTab = function (e) {

        var $el = $(e.currentTarget),
			tabId = $el.data('tabid'),
			$container = this._getTab(tabId),
            loaded = this._isLoaded($container);

        this._hideTabs();

        this._initTab({
            container: $container,
            loaded: loaded,
            tabId: tabId
        });
    };

    GroupEditor.prototype._evChangePage = function (data, tabModel) {
        this._ajaxGetTab({
            tabModel: tabModel,
            data: {
                Page: data.page,
                PageSize: data.pageSize || 5,
                TabId: tabModel.tabId
            }
        });
    };

    GroupEditor.prototype._evGoTop = function () {
        console.log(" -- go to top --", arguments);
    };

    GroupEditor.prototype._evRemove = function (e) {

        var $el = $(e.currentTarget),
            $item = $el.parents(this.options.groupItemSelector);

        $item.remove();

        this._toggleItemCheck(this._getTabItem($item.data('tabid'), $item.data('objid')));
    };

    GroupEditor.prototype._evAdd = function (e) {
        var $el = $(e.currentTarget),
            objId = $el.parents(this.options.tabItemSelector).data('objid'),
            tabModel = this._getSelectedTab(),
            tabId = tabModel.tabId,
            connectsWith = tabModel.connectsWith,
            $groups = this._getGroups(connectsWith);

        $.each($groups, $.proxy(function (idx, group) {
            if (!this._isInGroup(objId, tabId, $(group))) {

                // create template, add to group

                return false;
            }
        }, this));

        throw "[objId: " + objId + ", tabId: " + tabId + "] . not implemented yet";
    };

    GroupEditor.prototype._evEdit = function (e) {
        var $el = $(e.currentTarget),
            $item = $el.parents(this.options.groupItemSelector);
            objId = $item.data('objid'),
            tabId = $item.data('tabid'),
            groupId = $item.parents('[data-groupid]').data('groupid');

        throw "[objId: " + objId + ", groupId: " + groupId + ", tabId: " + tabId + "] . not implemented yet";
    };
    //#endregion

    //#region Ajax
    GroupEditor.prototype._ajaxGetTab = function (param) {
        var ajaxOptions = {
            name: this.options.uniqueName + "|getTab",
            url: this.options.getTabUrl,
            data: param.data,
            callbackData: param,
            context: this,
            success: $.proxy(this._ajaxGetTabSuccess, this),
            error: $.proxy(this._ajaxGetTabError, this),
            loadingElement: param.tabModel.container,
            loadingClass: 'loading'
        };

        $.bforms.ajax(ajaxOptions);
    };

    GroupEditor.prototype._ajaxGetTabSuccess = function (response, callback) {
        if (response) {

            var container = callback.tabModel.container;
            container.data('loaded', 'true');

            if (response.Html) {
                this._initTab({
                    container: container,
                    loaded: true,
                    html: response.Html,
                    tabId: callback.tabModel.tabId
                });
            }
        }
    };

    GroupEditor.prototype._ajaxGetTabError = function () {
        console.trace();
    };
    //#endregion

    //#region Helpers
    GroupEditor.prototype._checkItems = function () {
        var selectedTab = this._getSelectedTab(),
            $items = selectedTab.container.find(this.options.tabItemSelector);

        $.each($items, $.proxy(function (idx, item) {
            if (this._isItemSelected($(item).data('objid'), selectedTab.tabId, selectedTab.connectsWith)) {
                this._toggleItemCheck($(item));
            }
        }, this));
    };

    GroupEditor.prototype._isItemSelected = function (objid, tabId, groupIds) {
        var $groups = this._getGroups(groupIds), selected = true;

        $.each($groups, $.proxy(function (idx, group) {
            if (!this._isInGroup(objid, tabId, $(group))) {
                selected = false;
            }
        }, this));

        return selected;
    };

    GroupEditor.prototype._isInGroup = function (objId, tabId, $group) {
        var isInGroup = false,
            $groupItems = $group.find(this.options.groupItemSelector);

        $.each($groupItems, function (idx, item) {
            if ($(item).data('objid') == objId && $(item).data('tabid') == tabId) {
                isInGroup = true;
            }
        });
        return isInGroup;
    };

    GroupEditor.prototype._toggleItemCheck = function ($item) {
        var $glyph = $item.find('span.glyphicon'),
            addBtn = this.options.addBtn.replace(".", "");

        $item.toggleClass('selected');
        $glyph.parents('a:first').toggleClass(addBtn);

        if ($glyph.hasClass('glyphicon-ok')) {
            $glyph.removeClass('glyphicon-ok')
                  .addClass('glyphicon-plus')
        } else {
            $glyph.removeClass('glyphicon-plus')
                  .addClass('glyphicon-ok');
        }
    };

    GroupEditor.prototype._getSelectedTab = function () {
        var $container = this.$tabs.find('div[data-tabid]:visible'),
			tabId = $container.data('tabid'),
            connectsWith = $container.data('connectswith'),
	        loaded = this._isLoaded($container);

        return {
            container: $container,
            tabId: tabId,
            connectsWith: connectsWith,
            loaded: loaded
        };
    };

    GroupEditor.prototype._hideTabs = function () {

        var $containers = this.$tabs.find('div[data-tabid]');

        $containers.hide();
    };

    GroupEditor.prototype._isLoaded = function ($element) {

        var dataLoaded = $element.data('loaded');

        return dataLoaded == "true" || dataLoaded == "True" || dataLoaded == true
    };

    GroupEditor.prototype._getTab = function (tabId) {
        return this.$tabs.find('div[data-tabid="' + tabId + '"]');
    };

    GroupEditor.prototype._getTabItem = function (tabId, objId) {
        var $container = this._getTab(tabId),
            $item = $container.find(this.options.tabItemSelector + '[data-objid="' + objId + '"]');
        return $item;
    }

    GroupEditor.prototype._getGroup = function (groupId) {
        return this.$groups.find('div[data-groupid="' + groupId + '"]');
    }

    GroupEditor.prototype._getGroups = function (groupIds) {
        var $groups;
        if (groupIds) {
            $groups = [];
            $.each(groupIds, $.proxy(function (idx, groupId) {
                $groups.push(this._getGroup(groupId));
            }, this));
        } else {
            $groups = this.$groups.find('div[data-groupid]');
        }
        return $groups;
    };
    //#endregion

    $.widget('bforms.bsGroupEditor', GroupEditor.prototype);

    return GroupEditor;
});
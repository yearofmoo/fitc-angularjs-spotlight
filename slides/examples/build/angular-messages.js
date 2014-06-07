/**
 * @license AngularJS v1.3.0-local+sha.0411ca0
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/**
 * @ngdoc module
 * @name ngMessages
 * @description
 *
 * The `ngMessages` module provides enhanced support for displaying messages within an AngularJS form.
 * Instead of relying on JavaScript code and/or complex ng-if statements within your form template to
 * show and hide error messages specific to the state of an input field, the `ngMessage` and
 * `ngMessageOn` directives are designed to handle the complexity, inheritance and priority
 * sequencing based on the order of how the messages are defined in the template.
 *
 * Currently, the ngMessages module only contains the code for the `ngMessage`
 * and `ngMessageOn` directives.
 *
 * # Usage
 * The ngMessage directive listens on a key/value collection which is set on the ngMessage attribute.
 * Typically, due to the nature of ngModel, the `$error` object present on an instance of ngModel is
 * placed on the attribute as an expression.
 *
 * ```html
 * <form name="myForm">
 *   <input type="text" ng-model="field" name="myField" required minlength="5" />
 *   <div ng-message="myForm.myField.$error">
 *     <div ng-message-on="required">You did not enter a field</div>
 *     <div ng-message-on="minlength">The value entered is too short</div>
 *   </div>
 * </form>
 * ```
 *
 * Now whatever key/value entries are present within the provided object (in this case `$error`) then
 * the ngMessage directive will render the inner first ngMessageOn directive (depending if the key values
 * match the attribute value present on each ngMessageOn directive). In other words, if your errors
 * object contains the following data:
 *
 * ```javascript
 * <!-- keep in mind that ngModel automatically sets these error flags -->
 * myField.$error = { minlength : true, required : false };
 * ```
 *
 * Then the `required` message will be displayed first. When required is false then the minlenth message
 * will be displayed right after (since these messages are ordered this way in the template HTML code).
 * The prioritization of each message is determined by what order they're present in the DOM.
 * Therefore, instead of having custom JavaScript code determine the priority of what errors are
 * present before others, the presentation of the errors are handled within the template.
 *
 * By default, ngMessage will only display one error at a time. However, if you wish to display all
 * messages then the `ng-message-multiple` attribute flag can be used on the element containing the
 * ngMessage directive to make this happen.
 *
 * ```html
 * <div ng-message="myForm.myField.$error" ng-message-multiple="true">...</div>
 * ```
 *
 * ## Reusing and Overriding Messages
 * In addition to prioritization, ngMessage also allows for including messages from a remote or an inline
 * template. This allows for generic collection of messages to be reused across multiple parts of an
 * application.
 *
 * ```html
 * <script type="text/ng-template" id="error-messages">
 *   <div ng-message-on="required">This field is required</div>
 *   <div ng-message-on="minlength">This field is too short</div>
 * </script>
 * <div ng-message="myForm.myField.$error" ng-message-include="error-messages"></div>
 * ```
 *
 * However, including generic messages may not be useful enough to match all input fields, therefore,
 * ngMessage provides the ability to override messages defined in the remote template by redefining
 * then within the directive container.
 *
 * ```html
 * <!-- a generic template of error messages known as "error-messages" -->
 * <script type="text/ng-template" id="error-messages">
 *   <div ng-message-on="required">This field is required</div>
 *   <div ng-message-on="minlength">This field is too short</div>
 * </script>
 *
 * <form name="myForm">
 *   <input type="email"
 *          id="email"
 *          name="myEmail"
 *          ng-model="email"
 *          minlength="5"
 *          required />
 *
 *   <div ng-message="myForm.myEmail.$error" ng-message-include="error-messages">
 *     <!-- this required message has overridden the template message -->
 *     <div ng-message-on="required">You did not enter your email address</div>
 *
 *     <!-- this is a brand new message and will appear last in the prioritization -->
 *     <div ng-message-on="email">Your email address is invalid</div>
 *   </div>
 * </form>
 * ```
 *
 * In the example HTML code above the message that is set on required will override the corresponding
 * required message defined within the remote template. Therefore, with particular input fields (such
 * email addresses, date fields, autocomplete inputs, etc...), specialized error messages can be applied
 * while more generic messages can be used to handle other, more general input errors.
 *
 * ## Animations
 * If the `ngAnimate` module is active within the application then both the ngMessage and the
 * ngMessageOn directives will trigger animations whenever any messages are added and removed
 * from the DOM by the ngMessage directive.
 *
 * Whenever the ngMessage directive contains one or more visible messages then the `.ng-active` CSS
 * class will be added to the element. The `.ng-inactive` CSS class will be applied when there are no
 * animations present. Therefore, CSS transitions and keyframes as well as JavaScript animations can
 * hook into the animations whenever these classes are added/removed.
 *
 * Let's say that our HTML code for our messages container looks like so:
 *
 * ```html
 * <div ng-message="myMessages" class="my-messages">
 *   <div class="some-message" ng-message-on="alert">...</div>
 *   <div class="some-message" ng-message-on="fail">...</div>
 * </div>
 * ```
 *
 * Then the CSS animation code for the message container looks like so:
 *
 * ```css
 * .my-messages {
 *   transition:1s linear all;
 * }
 * .my-messages.ng-active {
 *   // messages are visible
 * }
 * .my-messages.ng-inactive {
 *   // messages are hidden
 * }
 * ```
 *
 * Whenever an inner message is attached (becomes visible) or removed (becomes hidden) then the enter
 * and leave animation is triggered for each particular element containing the ngMessageOn directive.
 *
 * Therefore, the CSS code for the inner messages looks like so:
 *
 * ```css
 * .some-message {
 *   transition:1s linear all;
 * }
 *
 * .some-message.ng-enter {}
 * .some-message.ng-enter.ng-enter-active {}
 *
 * .some-message.ng-leave {}
 * .some-message.ng-leave.ng-leave-active {}
 * ```
 *
 * {@link ngAnimate Click here} to learn how to use JavaScript animations or to learn more about ngAnimate.
 */
angular.module('ngMessages', [])

   /**
    * @ngdoc directive
    * @module ngMessages
    * @name ngMessage
    * @restrict A
    *
    * @description
    * # Overview
    * `ngMessage` is a directive that is designed to show and hide messages based on the state
    * of a key/value object that is listens on. The directive itself compliments error message
    * reporting with the `ngModel` $error object (which stores a key/value state of validation errors).
    *
    * `ngMessage` manages the state of internal messages within its container element. The internal
    * messages use the `ngMessageOn` directive and will be inserted/removed from the page depending
    * on if they're present within the key/value object. By default, only one message will be displayed
    * at a time and this depends on the prioritization of the messages within the template. (This can
    * be changed by using the ng-message-multiple on the directive container.)
    *
    * A remote template can also be used to promote message reuseability and messages can also be
    * overridden.
    *
    * {@link ngMessages Click here} to learn more about ngMessage and ngMessageOn.
    *
    * @usage
    * ```html
    * <ANY ng-message="expression">
    *   <ANY ng-message-on="keyValue1">...</ANY>
    *   <ANY ng-message-on="keyValue2">...</ANY>
    *   <ANY ng-message-on="keyValue3">...</ANY>
    * </ANY>
    * ```
    *
    * @param {string} ngMessage an angular expression evaluating to a key/value object
    *                 (this is typically the $error object on an ngModel instance).
    * @param {string=} ngMessageMultiple when set, all messages will be displayed with true
    *
    * @example
    * <example name="ngMessage-directive" module="ngMessageExample"
    *          deps="angular-messages.js"
    *          animations="true" fixBase="true">
    *   <file name="index.html">
    *     <form name="myForm">
    *       <label>Enter your name:</label>
    *       <input type="text"
    *              name="myName"
    *              ng-model="name"
    *              ng-minlength="5"
    *              ng-maxlength="20"
    *              required />
    *
    *       <pre>myForm.myName.$error = {{ myForm.myName.$error | json }}</pre>
    *
    *       <div ng-message="myForm.myName.$error" style="color:maroon">
    *         <div ng-message-on="required">You did not enter a field</div>
    *         <div ng-message-on="minlength">Your field is too short</div>
    *         <div ng-message-on="maxlength">Your field is too long</div>
    *       </div>
    *     </form>
    *   </file>
    *   <file name="script.js">
    *     angular.module('ngMessageExample', ['ngMessages']);
    *   </file>
    * </example>
    */
  .directive('ngMessage', ['$compile', '$animate',
                   function($compile,   $animate) {
    var ACTIVE_CLASS = 'ng-active';
    var INACTIVE_CLASS = 'ng-inactive';

    return {
      restrict: 'A',
      controller: function($scope) {
        this.$renderNgMessageClasses = angular.noop;

        var messages = [];
        this.$registerNgMessage = function(index, message) {
          for(var i = 0; i < messages.length; i++) {
            if(messages[i].type == message.type) {
              if(index != i) {
                var temp = messages[index];
                messages[index] = messages[i];
                if(index < messages.length) {
                  messages[i] = temp;
                } else {
                  messages.splice(0, i); //remove the old one (and shift left)
                }
              }
              return;
            }
          }
          messages.splice(index, 0, message); //add the new one (and shift right)
        };

        this.$renderMessages = function(values, multiple) {
          values = values || {};

          var found, messageValue;
          angular.forEach(messages, function(message) {
            if((!found || multiple) && (messageValue = truthyVal(values[message.type]))) {
              message.attach($scope, messageValue);
              found = true;
            } else {
              message.detach();
            }
          });

          this.$renderNgMessageClasses(found);

          function truthyVal(value) {
            return value !== null && value !== false && value;
          }
        };
      },
      require: ['ngMessage', '?^ngMessageInclude'],
      link: function($scope, element, attrs, ctrls) {
        var ctrl = ctrls[0];
        ctrl.$renderNgMessageClasses = function(bool) {
          bool ? $animate.setClass(element, ACTIVE_CLASS, INACTIVE_CLASS)
               : $animate.setClass(element, INACTIVE_CLASS, ACTIVE_CLASS);
        };

        var cachedValues, multiple = !!attrs.ngMessageMultiple;
        $scope.$watchCollection(attrs.ngMessage, function(values) {
          cachedValues = values;
          ctrl.$renderMessages(values, multiple);
        });
        if ( ctrls[1] && ctrls[1].tplPromise ) {
          ctrls[1].tplPromise.success(function processTemplate(html) {
            $scope.$evalAsync(function() {
              var after, container = angular.element('<div/>').html(html);
              angular.forEach(container.children(), function(elm) {
               elm = angular.element(elm);
               after ? after.after(elm)
                     : element.prepend(elm); //start of the container
               after = elm;
               $compile(elm)($scope);
              });
              ctrl.$renderMessages(cachedValues, multiple);
            });
          });
        }
      }
    };
  }])


  /**
   * @ngdoc directive
   * @name ngMessageInclude
   * @description
   * Use this directive to tell all {@link ngMessage} directives on descendent elements to this
   * where they can get their remote template
   * @param {string=} ngMessageInclude a string value corresponding to the remote template that will
   *                                   be included into the message container
   *
   */
  .directive('ngMessageInclude', function() {
    return {
      controller: ['$scope', '$attrs', '$http', '$templateCache', function($scope, $attrs, $http, $templateCache) {
        this.tplUrl = $attrs.ngMessageInclude;
        this.tplPromise = $http.get(this.tplUrl, { cache: $templateCache } );
      }]
    };
  })


   /**
    * @ngdoc directive
    * @name ngMessageOn
    * @scope
    *
    * @description
    * # Overview
    * `ngMessageOn` is a directive with the purpose to show and hide a particular message.
    * For ngMessageOn to operate, a parent `ngMessage` directive on a parent DOM element
    * must be situated since it determines which messages are visible based on the state
    * of the provided key/value map that `ngMessage` listens on.
    *
    * NgMessageOn will also create a special variable called `$content` specific to the
    * matching value entry for the key variable that matches the `ngMessageOn` attribute.
    *
    * @usage
    * ```html
    * <ANY ng-message="expression">
    *   <ANY ng-message-on="keyValue1">...</ANY>
    *   <ANY ng-message-on="keyValue2">...</ANY>
    *   <ANY ng-message-on="keyValue3">...</ANY>
    * </ANY>
    * ```
    *
    * {@link ngMessages Click here} to learn more about ngMessage and ngMessageOn.
    *
    * @param {string} ngMessageOn a string value corresponding to the message key.
    */
  .directive('ngMessageOn', ['$animate', function($animate) {
    var COMMENT_NODE = 8;
    return {
      require: '^ngMessage',
      transclude: 'element',
      terminal: true,
      restrict: 'A',
      link: function($scope, $element, attrs, ngMessage, $transclude) {
        var index, element, scope;

        var commentNode = $element[0];
        var parentNode = commentNode.parentNode;
        for(var i = 0, j = 0; i < parentNode.childNodes.length; i++) {
          var node = parentNode.childNodes[i];
          if(node.nodeType == COMMENT_NODE && node.nodeValue.indexOf('ngMessageOn') >= 0) {
            if(node === commentNode) {
              index = j;
              break;
            }
            j++;
          }
        }

        ngMessage.$registerNgMessage(index, {
          type : attrs.ngMessageOn,
          attach : function(parentScope, value) {
            if(!element) {
              scope = parentScope.$new();
              scope.$control = value;
              $transclude(scope, function(clone) {
                $animate.enter(clone, null, $element);
                element = clone;
              });
            }
          },
          detach : function(now) {
            if(element) {
              $animate.leave(element);
              scope.$destroy();
              element = scope = null;
            }
          }
        });
      }
    };
  }]);


})(window, window.angular);

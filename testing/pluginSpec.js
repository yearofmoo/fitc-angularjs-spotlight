describe("Plugin", function() {

  beforeEach(module("Plugin"));

  it("should compile properly", function() {
    module("templates");
    inject(function($compile, $rootScope) {
      var element = $compile('<div expand="5"></div>')($rootScope);
      $rootScope.$digest();

      debugger;
      expect(element.text().replace(/\s+/g, "")).toBe("12345");
    });
  });

});

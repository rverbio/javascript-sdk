import assert from 'assert';
import validation from '../src/validation';

describe('Validation', () => {
  describe('Email', () => {
    describe('isValidEmail', () => {
      it('Should return false for a null value', () => {
        assert.ok(!validation.isValidEmail(null));
      });
      it('Should return false for a blank string', () => {
        assert.ok(!validation.isValidEmail(''));
      });
      it('Should return false for [example@email]', () => {
        assert.ok(!validation.isValidEmail('example@email'));
      });
      it('Should return false for [email.com]', () => {
        assert.ok(!validation.isValidEmail('email.com'));
      });
      it('Should return true for [example@email.com]', () => {
        assert.ok(validation.isValidEmail('example@email.com'));
      });
    });
  });

  describe('String', () => {
    describe('isNullOrWhitespace', () => {
      it('Should return true for a null value', () => {
        assert.ok(validation.isNullOrWhiteSpace(null));
      });
      it('Should return true for a blank string', () => {
        assert.ok(validation.isNullOrWhiteSpace(''));
      });
      it('Should return true for [  ]', () => {
        assert.ok(validation.isNullOrWhiteSpace('  '));
      });
      it('Should return false for [awesome]', () => {
        assert.ok(!validation.isNullOrWhiteSpace('awesome'));
      });
    });
  });
});

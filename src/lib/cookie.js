/**
 * @fileoverview Browser cookie class.
 * @author ask
 * @since 1.0.0
 */
export class Cookie {
  /**
   * Constructor.
   *
   * @constructor
   * @param name - Cookie identifier.
   * @param [value] - Value of cookie. If not set
   * will use Cookie.read to find the existing value of the cookie with name
   * equal to the passed name. If the cookie is not found value will be an
   * empty string.
   * @param [days_dur] - Lifespan in days. If set to less than or
   * equal to 0 will set the lifespan to that of the session.
   * @returns
   */
  constructor(name, value, days_dur = 0) {
    this.name = name;
    // If value is set then simply assign it to this.value. If no value was
    // provided load it from the cookie string. If all else fails simply set
    // the value to an empty string.
    if (value) {
      this.value = value;
    } else {
      const cookie_string = RegExp(`${name}[^;]+`).exec(document.cookie);
      this.value = decodeURIComponent(
        cookie_string ? cookie_string.toString().replace(/^[^=]+./, '') : '',
      );
    }
    this.days_dur = days_dur;
    if (days_dur > 0) {
      const exp_date = new Date();
      exp_date.setTime(exp_date.getTime() + days_dur * Cookie.sec_to_day);
      this.expiration_date = exp_date;
    } else {
      this.expiration_date = null;
    }
  }
  /**
   * Gets and sets the value of the cookie.
   *
   * @param [value] - Value to set.
   * @returns - Cookie value if no value was provided, otherwise sets
   * the value to the new value and returns an empty string.
   */
  val(value) {
    if (value) {
      this.value = value;
      this.attach();
      if (typeof this.on_change === 'function') {
        this.on_change(value);
      }
      return '';
    }
    return this.value;
  }
  /**
   * Attatches the cookie to the document.
   *
   * @returns - This object for chaining functions.
   */
  attach() {
    const cookie_exp_str = this.expiration_date
      ? `; expires=${this.expiration_date.toUTCString()}`
      : '';
    const cookie_str =
      `${this.name}=${this.value || ''}` + cookie_exp_str + '; path=/;';
    document.cookie = cookie_str;
    return this;
  }
  /**
   * Removes the cookie from the document.
   *
   * @returns {Cookie} - This object for chaining functions.
   */
  remove() {
    document.cookie = `${this.name}=; Max-Age=-99999999`;
    return this;
  }
  /**
   * Updates the expiration date of the cookie and sets it equal to the
   * current date plus the pre-defined lifespan in days.
   *
   * @returns {Cookie} - This object for chaining functions.
   */
  refresh() {
    if (this.days_dur > 0) {
      const exp_date = new Date();
      const exp_time = exp_date.getTime();
      exp_date.setTime(exp_time + this.days_dur * Cookie.sec_to_day);
      this.expiration_date = exp_date;
    } else {
      this.expiration_date = null;
    }
    this.attach();
    return this;
  }
  /**
   * Override the toString default method from Object.
   *
   * @override
   * @returns - Value of cookie.
   */
  toString() {
    return this.value;
  }
}
Cookie.sec_to_day = 24 * 60 * 60 * 1000;
Cookie.on_change = () => false;

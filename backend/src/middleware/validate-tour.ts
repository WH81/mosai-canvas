import {
    Request,
    Response,
    NextFunction,
  } from 'express';
  
  /**
   * Fields accepted by the Tour API.
   *
   * Rejecting unknown fields prevents clients from
   * writing arbitrary properties into MongoDB.
   */
  const ALLOWED_FIELDS = new Set<string>([
    'date',
    'band',
    'venue',
    'city',
    'state',
  ]);
  
  /**
   * Maximum allowed lengths for Tour fields.
   */
  const MAX_LENGTHS = {
    band: 100,
    venue: 200,
    city: 100,
    state: 100,
  } as const;
  
  /**
   * Tour dates are intentionally stored as date-only
   * strings in YYYY-MM-DD format.
   *
   * This prevents timezone conversion problems such as:
   *
   * 2026-08-23 -> 2026-08-22
   */
  const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
  
  /**
   * Determines whether a year is a leap year.
   */
  function isLeapYear(year: number): boolean {
    return (
      year % 4 === 0 &&
      (year % 100 !== 0 || year % 400 === 0)
    );
  }
  
  /**
   * Returns the number of days in a given month.
   *
   * Month is 1-12.
   */
  function getDaysInMonth(
    year: number,
    month: number
  ): number {
    switch (month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        return 31;
  
      case 4:
      case 6:
      case 9:
      case 11:
        return 30;
  
      case 2:
        return isLeapYear(year) ? 29 : 28;
  
      default:
        return 0;
    }
  }
  
  /**
   * Validates a Tour date.
   *
   * Accepted:
   *   2026-08-23
   *   2028-02-29
   *
   * Rejected:
   *   2026-02-30
   *   2026-13-01
   *   2026-00-10
   *   08/23/2026
   *   2026-8-23
   */
  export function isValidTourDate(
    value: string
  ): boolean {
    /**
     * Check the basic YYYY-MM-DD format first.
     */
    if (!DATE_PATTERN.test(value)) {
      return false;
    }
  
    /**
     * Split the date into numeric components.
     */
    const parts = value.split('-');
  
    if (parts.length !== 3) {
      return false;
    }
  
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);
  
    /**
     * Make sure all values are valid numbers.
     */
    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(day)
    ) {
      return false;
    }
  
    /**
     * Validate month.
     */
    if (month < 1 || month > 12) {
      return false;
    }
  
    /**
     * Validate day.
     */
    const daysInMonth = getDaysInMonth(
      year,
      month
    );
  
    if (
      day < 1 ||
      day > daysInMonth
    ) {
      return false;
    }
  
    return true;
  }
  
  /**
   * Validates a required string field.
   */
  function validateRequiredString(
    value: unknown,
    fieldName: string,
    maxLength: number
  ): string | null {
    if (typeof value !== 'string') {
      return `${fieldName} must be a string.`;
    }
  
    const trimmedValue = value.trim();
  
    if (trimmedValue.length === 0) {
      return `${fieldName} is required.`;
    }
  
    if (trimmedValue.length > maxLength) {
      return `${fieldName} must be ${maxLength} characters or fewer.`;
    }
  
    return null;
  }
  
  /**
   * Middleware used by POST /api/tours
   * and PUT /api/tours/:id.
   *
   * Responsibilities:
   *
   * 1. Validate request body.
   * 2. Reject unexpected properties.
   * 3. Validate date.
   * 4. Validate required strings.
   * 5. Trim user input.
   * 6. Replace req.body with sanitized data.
   *
   * Authentication should be handled separately
   * by the admin authentication middleware.
   */
  export const validateTour = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const body: unknown = req.body;
  
    /**
     * Request body must be a plain object.
     */
    if (
      body === null ||
      typeof body !== 'object' ||
      Array.isArray(body)
    ) {
      res.status(400).json({
        message:
          'Request body must be a valid object.',
      });
  
      return;
    }
  
    /**
     * TypeScript needs to know that body is an
     * object with string keys.
     */
    const tourData = body as Record<
      string,
      unknown
    >;
  
    /**
     * Reject unsupported fields.
     */
    const unexpectedFields = Object.keys(
      tourData
    ).filter(
      (field) =>
        !ALLOWED_FIELDS.has(field)
    );
  
    if (unexpectedFields.length > 0) {
      res.status(400).json({
        message:
          'Request contains unsupported fields.',
        fields: unexpectedFields,
      });
  
      return;
    }
  
    /**
     * Validate date.
     *
     * IMPORTANT:
     * This calls isValidTourDate(), which is the
     * function actually defined above.
     */
    if (
      typeof tourData.date !== 'string' ||
      !isValidTourDate(
        tourData.date.trim()
      )
    ) {
      res.status(400).json({
        message:
          'Date must be a valid date in YYYY-MM-DD format.',
      });
  
      return;
    }
  
    /**
     * Validate Band.
     */
    const bandError =
      validateRequiredString(
        tourData.band,
        'Band',
        MAX_LENGTHS.band
      );
  
    if (bandError) {
      res.status(400).json({
        message: bandError,
      });
  
      return;
    }
  
    /**
     * Validate Venue.
     */
    const venueError =
      validateRequiredString(
        tourData.venue,
        'Venue',
        MAX_LENGTHS.venue
      );
  
    if (venueError) {
      res.status(400).json({
        message: venueError,
      });
  
      return;
    }
  
    /**
     * Validate City.
     */
    const cityError =
      validateRequiredString(
        tourData.city,
        'City',
        MAX_LENGTHS.city
      );
  
    if (cityError) {
      res.status(400).json({
        message: cityError,
      });
  
      return;
    }
  
    /**
     * Validate State.
     */
    const stateError =
      validateRequiredString(
        tourData.state,
        'State',
        MAX_LENGTHS.state
      );
  
    if (stateError) {
      res.status(400).json({
        message: stateError,
      });
  
      return;
    }
  
    /**
     * Sanitize and normalize the data before
     * passing control to the controller.
     */
    req.body = {
      date: (tourData.date as string).trim(),
      band: (tourData.band as string).trim(),
      venue: (tourData.venue as string).trim(),
      city: (tourData.city as string).trim(),
      state: (tourData.state as string).trim(),
    };
  
    next();
  };
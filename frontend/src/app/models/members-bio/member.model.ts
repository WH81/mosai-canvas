export interface Member {
  /**
   * Unique MongoDB identifier for the member.
   *
   * Optional because this property is not available yet when
   * creating a new member.
   */
  _id?: string;

  /**
   * Member's display name.
   */
  name: string;

  /**
   * Primary instrument or role performed by the member.
   */
  instrument: string;

  /**
   * MongoDB ID of the band this member belongs to.
   *
   * This relationship is primarily managed by the backend.
   */
  band: string;

  /**
   * Slug of the band this member belongs to.
   *
   * This is useful when working with public band routes.
   */
  bandSlug: string;

  /**
   * URL or application path for the member's image.
   */
  image: string;

  /**
   * Member biography.
   */
  bio: string;

  /**
   * Member's social media links.
   *
   * Individual properties are optional because a member may
   * not have accounts on every platform.
   */
  socialLinks?: SocialLinks | null;

  /**
   * Member's music streaming links.
   *
   * Individual properties are optional because a member may
   * not have profiles on every platform.
   */
  streamingLinks?: StreamingLinks | null;
}

/**
 * Social media links associated with a member.
 */
export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  x?: string;
  youtube?: string;
  tiktok?: string;
}

/**
 * Music streaming links associated with a member.
 */
export interface StreamingLinks {
  spotify?: string;
  appleMusic?: string;
  soundCloud?: string;
}
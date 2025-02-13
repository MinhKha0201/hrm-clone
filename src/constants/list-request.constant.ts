export const STATUS_STYLE: Record<string, string> = {
  APPROVED: 'w-[80px] justify-center bg-green-500 hover:bg-green-500',
  PENDING: 'w-[80px] justify-center bg-yellow-500 hover:bg-yellow-500',
  REJECTED: 'w-[80px] justify-center bg-red-500 hover:bg-red-500',
  CANCELLED: 'w-[80px] justify-center bg-gray-300 hover:bg-gray-300 text-black',
};

export enum STATUS {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum DEFAULT_EMAIL {
  ADMIN = 'admin@lutech.ltd',
}

export enum IdsToOpenDuration {
  GO_LATE = '6773a642324b48f6179bbf89',
  LEAVE_EARLY = '6773a642324b48f6179bbf8a',
}

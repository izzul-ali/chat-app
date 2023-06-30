function parseTime(dateTime: Date): string {
  const currentTIme = new Date();
  const _dateTime = new Date(dateTime);

  if (_dateTime.toString() === 'Invalid Date') {
    return '';
  }

  return Intl.DateTimeFormat('id', {
    dateStyle: _dateTime.getDay() < currentTIme.getDay() ? 'short' : undefined,
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(_dateTime);
}

describe('parse time test', () => {
  it('should parse time', () => {
    expect(parseTime(new Date())).not.toBe('');
  });

  it('should parse invalid time', () => {
    expect(parseTime(new Date('invalid'))).toBe('');
  });
});

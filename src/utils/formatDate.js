import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns'

export const formatDate = (date, includeTime = false) => {
  const dateObj = new Date(date)
  
  if (isToday(dateObj)) {
    return includeTime ? format(dateObj, 'HH:mm') : 'Today'
  }
  
  if (isYesterday(dateObj)) {
    return includeTime ? `Yesterday ${format(dateObj, 'HH:mm')}` : 'Yesterday'
  }
  
  return format(dateObj, includeTime ? 'MMM d, yyyy HH:mm' : 'MMM d, yyyy')
}

export const formatRelativeTime = (date) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}
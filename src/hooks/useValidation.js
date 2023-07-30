export default function useValidation() {
  const validEmail = new RegExp('^[a-zA-Z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$')

  const validThai = new RegExp('^[\u0E00-\u0E7F.-]{1,}(s[\u0E00-\u0E7F.-]{1,}){0,2}?$')
  const validEng = new RegExp('^[a-zA-Z]+$')
  const validNumber = new RegExp('^[0-9]+$')

  return { validEmail, validThai, validEng, validNumber }
}

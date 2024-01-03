const test1 = () => {

}

const _isPalindrom = (word) => {
    const reversed =  word.split('').reverse().join('')
    const result = word === reversed
    console.log('result', result)
    return result
}

export { _isPalindrom }

export default test1


function twoSum(numbers, target) {
  const operation = numbers.reduce((values, current, index) => {
    const operationPerIndex = [...numbers].slice(index, numbers.length - 1)
    
    const findedSum = operationPerIndex.find(number => {
      console.log(number + current === target)

      return current + number === target
    })
    
    return findedSum > -1 ? [index, findedSum] : values
  }, [])
  
  return operation
}

console.log(twoSum([1,2,3], 4))
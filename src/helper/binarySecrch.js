import mongoose from "mongoose"; 
const { ObjectId } = mongoose.Types;

export function binarySearchObjectId(arr, targetId) {
  // Ensure targetId is an ObjectId
  const target = new ObjectId(targetId.toString());

  let left = 0;
  let right = arr.length - 1;

  // Sort the array first (if not already sorted)
  // Comparing string values of ObjectIds
  arr.sort((a, b) => a.toString().localeCompare(b.toString()));

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const midVal = arr[mid];

    const comparison = midVal.toString().localeCompare(target.toString());

    if (comparison === 0) {
      return mid; 
    } else if (comparison < 0) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return -1; 
}

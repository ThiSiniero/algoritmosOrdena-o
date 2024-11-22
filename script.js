function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    let startTime, sortedNumbers, timeTaken;

    if (!file) {
        alert("Por favor, selecione um arquivo.");
        return;
    }

    const reader = new FileReader();
    const selectedAlgorithm = document.getElementById("sortSelect").value;

    reader.onload = function(event) {
        const fileContent = event.target.result;

        const numbers = fileContent.split(/\s+/) // Divide por espaços ou novas linhas
                                   .map(Number) // Converte para números
                                   .filter(num => !isNaN(num)); // Filtra valores não numéricos

        if (numbers.length === 0) {
            alert("O arquivo não contém números válidos.");
            return;
        }
        try {
          startTime = performance.now();
          sortedNumbers = window[selectedAlgorithm](numbers);
          endTime = performance.now();
          timeTaken = endTime - startTime;
        } catch (error) {
          document.getElementById('sortedResult').textContent = "Erro de estouro de pilha, por favor tente com uma quantidade menor de numeros."
        }
        
        document.getElementById('executionTime').textContent = `Tempo de Execução: ${timeTaken.toFixed(2)} ms`;
        document.getElementById('sortedResult').textContent = sortedNumbers.map(num => num.toString().padStart(3, '0')).join(' - ');

        document.getElementById('sortedResult').style.backgroundColor = "#f5f5f5";
        document.getElementById('sortedResult').style.border = "1px solid #ccc"
    };
    reader.readAsText(file);
}

function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Troca
        }
      }
    }
    return arr;
}

function selectionSort(arr) {
    for (let i = 0; i < arr.length; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]; // Troca
    }
    return arr;
}

function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let current = arr[i];
        let j = i - 1;

        while (j >= 0 && arr[j] > current) {
            arr[j + 1] = arr[j];
            j--;
        }

        arr[j + 1] = current;
    }
    return arr;
}

function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const middle = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, middle));
    const right = mergeSort(arr.slice(middle));
    
    return merge(left, right);
  }
  
  function merge(left, right) {
    let result = [], i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) result.push(left[i++]);
      else result.push(right[j++]);
    }
    
    return result.concat(left.slice(i), right.slice(j));
}

function quickSort(arr) {
    if (arr.length <= 1) return arr;
    
    let pivot = arr[arr.length - 1];
    let left = [], right = [];
    
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] < pivot) left.push(arr[i]);
      else right.push(arr[i]);
    }
    
    return [...quickSort(left), pivot, ...quickSort(right)];
}  

function heapSort(arr) {
    function heapify(arr, n, i) {
      let largest = i;
      let left = 2 * i + 1;
      let right = 2 * i + 2;
      
      if (left < n && arr[left] > arr[largest]) largest = left;
      if (right < n && arr[right] > arr[largest]) largest = right;
      
      if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
      }
    }
    
    const n = arr.length;
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arr, n, i);
    }
    
    for (let i = n - 1; i > 0; i--) {
      [arr[0], arr[i]] = [arr[i], arr[0]];
      heapify(arr, i, 0);
    }
    return arr;
}

function radixSort(arr) {
    const max = Math.max(...arr);
    let exp = 1;
    
    while (Math.floor(max / exp) > 0) {
      countingSortByExp(arr, exp);
      exp *= 10;
    }
    return arr;
  }
  
function countingSortByExp(arr, exp) {
    const output = new Array(arr.length);
    const count = new Array(10).fill(0);
  
    for (let i = 0; i < arr.length; i++) {
      count[Math.floor(arr[i] / exp) % 10]++;
    }
  
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }
  
    for (let i = arr.length - 1; i >= 0; i--) {
      output[count[Math.floor(arr[i] / exp) % 10] - 1] = arr[i];
      count[Math.floor(arr[i] / exp) % 10]--;
    }
  
    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
    }
}

function shellSort(arr) {
  let n = arr.length;

  // Inicializa o gap, começando em n/2 e reduzindo pela metade a cada iteração
  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      // Realiza o Insertion Sort para elementos separados pelo gap
      for (let i = gap; i < n; i++) {
          let temp = arr[i]; // Elemento atual sendo analisado
          let j;

          // Move os elementos do array que estão distantes pelo gap
          for (j = i; j >= gap && arr[j - gap] > temp; j -= gap) {
              arr[j] = arr[j - gap];
          }

          // Coloca o elemento temporário na posição correta
          arr[j] = temp;
      }
  }

  return arr; // Retorna o array ordenado
}
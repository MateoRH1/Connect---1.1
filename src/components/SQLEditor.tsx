import { useState } from 'react'

export function SQLEditor() {
  const [query, setQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])

  const executeQuery = async () => {
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      })
      
      const data = await response.json()
      if (data.error) throw new Error(data.error)
      
      setResults(data.results)
      setColumns(data.columns)
      setError(null)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Unknown error occurred')
      }
    }
  }

  return (
    <div className="sql-editor">
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows={10}
      />
      <button onClick={executeQuery}>Ejecutar</button>
      {error && <div className="error">{error}</div>}
      {results.length > 0 && (
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j}>{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

import React from 'react'
import { View, Text } from 'react-native'

const WHITE = 'rgb(230, 233, 198)'
const BLACK = 'rgb(100, 133, 68)'

interface RowProps {
  row: number
}
interface CellProps extends RowProps {
  col: number
}

class Background extends React.Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        {new Array(8).fill(0).map((_, row) => (
          <Row key={row} row={row} />
        ))}
      </View>
    )
  }
}

const Row = ({ row }: RowProps) => {
  return (
    <View style={{ flex: 1, flexDirection: 'row' }}>
      {new Array(8).fill(0).map((_, col) => (
        <Cell key={col} row={row} col={col} />
      ))}
    </View>
  )
}

const Cell = ({ row, col }: CellProps) => {
  const backgroundColor = (row + col) % 2 === 0 ? WHITE : BLACK
  const color = (row + col) % 2 === 0 ? BLACK : WHITE
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor,
        padding: 3,
        opacity: 0.8,
      }}
    >
      {/* <Text style={{ color, fontWeight: '600', opacity: col === 0 ? 1 : 0 }}>{8 - row}</Text> */}
      {/* <Text style={{ color, fontWeight: '600', opacity: row === 7 ? 1 : 0, alignSelf: 'flex-end' }}>
        {String.fromCharCode('a'.charCodeAt(0) + col)}
      </Text> */}
    </View>
  )
}

export default Background

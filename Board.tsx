import React, { useCallback, useRef, useState } from 'react'
import { View, StyleSheet, Dimensions, Text } from 'react-native'
import { Chess, Square } from 'chess.js'

import Background from './Background'
import Piece from './Piece'
import {
  GestureHandlerGestureEventNativeEvent,
  TapGestureHandler,
  TapGestureHandlerEventExtra,
  TapGestureHandlerGestureEvent,
  TapGestureHandlerStateChangeEvent,
  TouchableHighlight,
} from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedGestureHandler } from 'react-native-reanimated'
import { coordsToPosition, SIZE } from './Notation'

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    width,
    height: width,
  },
  gameOver: {
    position: 'absolute',
    zIndex: 101,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    backgroundColor: '#333',
    fontSize: 22,
    padding: 10,
    color: 'white',
  },
  btn: {
    marginTop: 5,
    padding: 7,
    paddingHorizontal: 15,
    borderRadius: 100,
    backgroundColor: '#333',
  },
  btnText: {
    color: 'white',
  },
})

const Board = () => {
  const chess = useRef(new Chess()).current
  const [pieces, setPieces] = useState(() => chess.board())
  const [player, setPlayer] = useState<'w' | 'b'>('w')
  const [checkmate, setCheckmate] = useState(false)
  const [draw, setDraw] = useState(false)
  const onMove = useCallback(() => {
    setPieces(chess.board())
    setPlayer(player => (player === 'w' ? 'b' : 'w'))
    if (chess.in_checkmate()) setCheckmate(true)
    if (chess.in_draw()) setDraw(true)
  }, [])
  const onReset = () => {
    chess.reset()
    setPieces(chess.board())
    setPlayer('w')
    setCheckmate(false)
    setDraw(false)
  }

  return (
    <View style={styles.container}>
      <Background />
      {pieces.map((piecesRow, row) =>
        piecesRow.map((piece, col) => {
          if (!piece) return null
          const id = `${piece.color}${piece.type}` as const
          return (
            piece && (
              <Piece
                enabled={player === piece.color}
                key={`${id}${row}${col}`}
                id={id}
                row={row}
                col={col}
                chess={chess}
                onMove={onMove}
              />
            )
          )
        })
      )}
      {(checkmate || draw) && (
        <View style={styles.gameOver}>
          {checkmate && (
            <Text style={styles.gameOverText}>
              Player {player === 'w' ? 'black' : 'white'} wins
            </Text>
          )}
          {draw && <Text style={styles.gameOverText}>Draw</Text>}
          <TouchableHighlight onPress={onReset} style={styles.btn}>
            <Text style={styles.btnText}>Play again</Text>
          </TouchableHighlight>
        </View>
      )}
    </View>
  )
}

export default Board

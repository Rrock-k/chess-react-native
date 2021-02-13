import { ChessInstance, Square } from 'chess.js'
import React, { useCallback } from 'react'
import { StyleSheet, Image } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

import { SIZE, toPosition, toTranslation } from './Notation'

export type Player = 'b' | 'w'
type Type = 'q' | 'r' | 'n' | 'b' | 'k' | 'p'
type Piece = `${Player}${Type}`
type Pieces = Record<Piece, ReturnType<typeof require>>
export const PIECES: Pieces = {
  br: require('./assets/br.png'),
  bp: require('./assets/bp.png'),
  bn: require('./assets/bn.png'),
  bb: require('./assets/bb.png'),
  bq: require('./assets/bq.png'),
  bk: require('./assets/bk.png'),
  wr: require('./assets/wr.png'),
  wn: require('./assets/wn.png'),
  wb: require('./assets/wb.png'),
  wq: require('./assets/wq.png'),
  wk: require('./assets/wk.png'),
  wp: require('./assets/wp.png'),
}

interface PieceProps {
  id: Piece
  row: number
  col: number
  chess: ChessInstance
  onMove: () => void
  enabled: boolean
}

const styles = StyleSheet.create({
  piece: {
    width: SIZE,
    height: SIZE,
  },
})

const Piece = ({ id, row, col, chess, onMove, enabled }: PieceProps) => {
  const offsetX = useSharedValue(col * SIZE)
  const offsetY = useSharedValue(row * SIZE)
  const translateX = useSharedValue(col * SIZE)
  const translateY = useSharedValue(row * SIZE)
  const isActive = useSharedValue(false)
  const movePiece = useCallback(
    (from: Square, to: Square) => {
      const moves = chess.moves({ verbose: true })
      const move = moves.find(move => move.from === from && move.to === to)

      const { x, y } = toTranslation(move ? to : from)

      const callback = () => {
        if (move) {
          chess.move({ from, to })
          onMove()
        }
      }

      translateX.value = withTiming(x, { duration: move ? 100 : 300 })
      translateY.value = withTiming(y, { duration: move ? 100 : 300 }, () => {
        isActive.value = false
        runOnJS(callback)()
      })
    },
    [chess, translateX, translateY, onMove]
  )
  const piece = useAnimatedStyle(() => ({
    position: 'absolute',
    zIndex: isActive.value ? 100 : 1,
    width: SIZE,
    height: SIZE,
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
  }))
  const from = useAnimatedStyle(() => ({
    position: 'absolute',
    opacity: isActive.value ? 1 : 0,
    backgroundColor: '#ff07',
    width: SIZE,
    height: SIZE,
    transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
  }))
  const to = useAnimatedStyle(() => {
    const { x, y } = toTranslation(toPosition({ x: translateX.value, y: translateY.value }))
    const isAnotherCell = x !== offsetX.value || y !== offsetY.value
    return {
      position: 'absolute',
      opacity: isActive.value && isAnotherCell ? 1 : 0,
      backgroundColor: '#ff07',
      width: SIZE,
      height: SIZE,
      transform: [{ translateX: x }, { translateY: y }],
    }
  })
  const onPanGestureEvent = useAnimatedGestureHandler({
    onStart: () => {
      offsetX.value = translateX.value
      offsetY.value = translateY.value
      isActive.value = true
    },
    onActive: ({ translationX, translationY }) => {
      translateX.value = translationX + offsetX.value
      translateY.value = translationY + offsetY.value
    },
    onEnd: () => {
      const from = toPosition({ x: offsetX.value, y: offsetY.value })
      const to = toPosition({
        x: translateX.value,
        y: translateY.value,
      })
      runOnJS(movePiece)(from, to)
    },
  })

  return (
    <>
      <Animated.View style={from} />
      <Animated.View style={to} />
      <Animated.View style={piece}>
        <PanGestureHandler onGestureEvent={onPanGestureEvent} enabled={enabled}>
          <Animated.View>
            <Image source={PIECES[id]} style={styles.piece} />
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </>
  )
}

export default React.memo(Piece)

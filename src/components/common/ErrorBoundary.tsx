/* eslint-disable react/prop-types */
import React, { Component, ReactNode } from 'react'

import { RootStackParamList } from '@/types/navigation'

import type { StackNavigationProp } from '@react-navigation/stack'

interface ErrorBoundaryProps {
  children: ReactNode
  navigation?: StackNavigationProp<RootStackParamList, 'Error'>
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)

    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary Error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.navigation) {
        this.props.navigation.navigate('Error')
      }

      return null
    }

    return this.props.children
  }
}

export default ErrorBoundary

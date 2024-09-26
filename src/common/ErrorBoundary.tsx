import { type StackNavigationProp } from '@react-navigation/stack'
import React, { Component, ReactNode } from 'react'

import { RootStackParamList } from '@/types/navigation'

interface ErrorBoundaryProps {
  children: ReactNode
  navigation: StackNavigationProp<RootStackParamList>
}

interface ErrorBoundaryState {
  hasError: boolean
}
/* eslint-disable react/prop-types */
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
      this.props.navigation.navigate('Error')

      return null
    }

    return this.props.children
  }
}

export default ErrorBoundary

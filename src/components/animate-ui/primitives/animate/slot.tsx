'use client';

import * as React from 'react';
import { motion, isMotionComponent, type HTMLMotionProps } from 'motion/react';
import { cn } from '@/lib/utils';

type AnyProps = Record<string, unknown>;

type DOMMotionProps<T extends HTMLElement = HTMLElement> = Omit<
  HTMLMotionProps<keyof HTMLElementTagNameMap>,
  'ref'
> & { ref?: React.Ref<T> };

type WithAsChild<Base extends object> =
  | (Base & { asChild: true; children: React.ReactElement })
  | (Base & { asChild?: false | undefined });

type SlotProps<T extends HTMLElement = HTMLElement> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: any;
} & DOMMotionProps<T>;

function mergeRefs<T>(...refs: (React.Ref<T> | undefined)[]): React.RefCallback<T> {
  return node => {
    refs.forEach(ref => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.RefObject<T | null>).current = node;
      }
    });
  };
}

function mergeProps<T extends HTMLElement>(
  childProps: AnyProps,
  slotProps: DOMMotionProps<T>
): AnyProps {
  const merged: AnyProps = { ...childProps, ...slotProps };

  if (childProps.className || slotProps.className) {
    merged.className = cn(childProps.className as string, slotProps.className as string);
  }

  if (childProps.style || slotProps.style) {
    merged.style = {
      ...(childProps.style as React.CSSProperties),
      ...(slotProps.style as React.CSSProperties),
    };
  }

  return merged;
}

// Map to cache dynamically created motion components and avoid memory leaks
// We use a WeakMap because React component types (functions/classes) are objects
// and we don't want to prevent them from being garbage collected.
// For string primitives (like 'div'), we use a regular Map.
const motionComponentObjectCache = new WeakMap<object, React.ElementType>();
const motionComponentStringCache = new Map<string, React.ElementType>();

function getMotionComponent(elementType: React.ElementType) {
  if (typeof elementType === 'object' && elementType !== null && isMotionComponent(elementType)) {
    return elementType;
  }

  if (typeof elementType === 'string' && isMotionComponent(elementType)) {
    return elementType;
  }

  if (typeof elementType === 'string') {
    if (!motionComponentStringCache.has(elementType)) {
      motionComponentStringCache.set(elementType, motion.create(elementType));
    }
    return motionComponentStringCache.get(elementType)!;
  } else {
    const objectType = elementType as object;
    if (!motionComponentObjectCache.has(objectType)) {
      motionComponentObjectCache.set(objectType, motion.create(elementType));
    }
    return motionComponentObjectCache.get(objectType)!;
  }
}

function Slot<T extends HTMLElement = HTMLElement>({ children, ref, ...props }: SlotProps<T>) {
  const isValid = React.isValidElement(children);
  const childType = isValid ? children.type : null;

  if (!isValid || !childType) return null;

  const Base = getMotionComponent(childType as React.ElementType);

  const { ref: childRef, ...childProps } = children.props as AnyProps;

  const mergedProps = mergeProps(childProps, props);

  return React.createElement(Base, {
    ...mergedProps,
    ref: mergeRefs(childRef as React.Ref<T>, ref),
  });
}

export { Slot, type SlotProps, type WithAsChild, type DOMMotionProps, type AnyProps };
